const progressModel = require("./progressModel")
const myLearning = require("../myLearning/myLearning.model")
const { publishMaterials } = require('../../courses/materialsModel');
const { PROGRESS_STS, MATERIAL } = require('../../../configuration/constants/courseConstant')
const { S3_LOGO_URL } = require("../../../configuration/constants/s3Constant")
const {ObjectId} = require('mongodb')
const { JWT_STRING } = require("../../../configuration/constants/authConstant")
const { ssoGenerateToken } = require("../../../configuration/common")
const path = require('path')
const QRCode = require('qrcode');
const { SERIES } = require("../../../configuration/constants/paymentConstant");
const { JOB_NAME } = require("../../../configuration/constants/queueConstant");
const { idGenerator } = require('../../../configuration/common')
const { generateWeasyprintPdfAndUpload } = require('../../../services/generatePdfAndUpload')
const { createJobQueue } = require('../../../services/bull-jobs/createJobs');
const axios = require('axios')
const { publishCourses } = require("../../courses/courseModel");
const Certificate = require("../../certificates/certificate.model");
const { assignQuizAndQuestions, submitQuiz } = require('../../quizProgress/quizService');
const moment = require("moment")
const updateProgress = async (data, authToken) => {
    try {
        if(data.quizObj) {
            data.quizObj.userId = data.userId,
            data.quizObj.createdBy = data.userId,
            data.quizObj.updatedBy = data.userId,
            await submitQuiz(data.quizObj)
            // return false when quiz fail
            if(data.quizObj.resetQuiz){
                return {flag:false,data:data.quizObj};
            }
        }
        const publishMaterial = await publishMaterials.findOne({ _id: data?.materialId });
        data.percent = publishMaterial?.completionPercent;
        progressModel.findOneAndUpdate({ userId: data?.userId, materialId: data?.materialId }, data, { new: true, upsert: true }).then(() => {
            data.currentId = data?.sts == PROGRESS_STS.COMPLETED ? data?.nextId : data?.materialId;
            coursePercentage(data, authToken, true)
        });

        return {flag:true};
    } catch (error) {
        logger.error(" Error - updateProgress ", error);
        throw new Error(error)
    }
}

const coursePercentage = async (payloadObj, authToken, updateSingleUser) => {
    // NEED TO CONFIRM WITH CLIENT. PLEASE DON'T REMOVE THIS CODE.
    // if(!updateSingleUser) {
    //     payloadObj?.materials?.map(async(material) => {
    //         await progressModel.updateMany({ materialId: material?._id },{percent: material?.completionPercent});
    //     })
    // }
    const progressData = await progressModel.aggregate([
        {
            $match: {
                sts: PROGRESS_STS.COMPLETED,
                courseId: ObjectId(payloadObj?.courseId),
                ...(updateSingleUser ? { userId: ObjectId(payloadObj?.userId) } : {}),                
                deletedAt: {
                    $exists: false
                },
            }
        },
        {
            $group:{
                _id:"$userId",
                id: {$first: "$_id"},
                totalPercent: {$sum: "$percent"},
            }
        },
        {
            $addFields:{
                totalPercent: { $round: ["$totalPercent", 0]}
            }
        }
    ])
    await Promise.all(_.map(progressData, (data) => {
        let commonObject = { progress: data?.totalPercent, currentId: payloadObj?.currentId, sts: data?.totalPercent == 100 ? PROGRESS_STS.COMPLETED : PROGRESS_STS.INPROGRESS }
        const updateObj = payloadObj?.currentId && payloadObj?.playFrom ? Object.assign(commonObject, {lastPlayTime : payloadObj?.playFrom}) : commonObject;
        myLearning.findOneAndUpdate({ userId: data?._id, courseId: payloadObj?.courseId, sts: PROGRESS_STS.INPROGRESS }, updateObj, { new: true })
        .populate('courseId userId currentId')
        .then(async (data) => {
            //sentObjToOgm
            let sentObjToOrbitProject = {
                courseId: data?.courseId?._id,
                courseSlug: data?.courseId?.slug,
                progress: data?.progress,
                email: data?.userId?.email,
                isFromOgm: data?.isFromOgm,
                isFromOsc: data?.isFromOsc
            }
            if(data?.currentId?.type == MATERIAL.QUIZ || data?.currentId?.type == MATERIAL.QUIZ_WITH_CERTIFICATE) {  
                let quizObj = {
                    courseId: data?.courseId?._id,
                    quizId: data?.currentId?._id,
                    quizType:data?.currentId?.type == data?.currentId?.type,
                    userId: data?.userId?._id,
                    userNm: data?.userId?.name
                }
                assignQuizAndQuestions(quizObj);
            }
            if(data?.progress == 100){
                certificateQueueFunction(data, sentObjToOrbitProject);
            }
        })
    }))
}

const updateOrbitProjectCourseProgress = async (data) => {
    try {
        const authToken = await ssoGenerateToken(data)
        const config = {
            headers: {
                Authorization: `${JWT_STRING}${authToken.data.data.token}`
            },
            data,
            method: "PUT",
        };
        if (data.isFromOsc){
            config.url= `${process.env.OSC_API_URL}/web/user-workflow/update/course-progress`
            config.headers.origin = process.env.OSC_ALLOW_ORIGIN
        }else{
            config.url = `${process.env.OGM_API_URL}/web/user-stages/update/course-progress`
        }
        await axios(config)

        return { flag: true }
    } catch (error) {
        logger.error("Error-updateOrbitProjectCourseProgress", error)
    }
}

const certificateQueueFunction = async(courseData, orbitProjectObj) => {
    courseData.courseId = await publishCourses.findOne({ _id: courseData?.courseId?._id }).populate({ path: "userId" , populate: { path: "profileId" }})
    const certiGenerateObj = {
        courseData, 
        orbitProjectObj
      }
    await createJobQueue(JOB_NAME.GENERATE_CERTIFICATE, certiGenerateObj); // 3rd params is optional and it is options for job.
}

const generateCertificate = async (processedObj) => {
    try{
        let { courseData } = processedObj, certificateDoc
        certificateDoc = await Certificate.findOne({ _id: courseData?.courseId?.certificateId })
        const certificateCode = `AIHQ-${await idGenerator(SERIES.CERTIFICATE)}-${moment().format("YYYY-MM")}`
        const qr = await generateQRCode(`${process.env.CERTIFICATE_FRONT_URL}${certificateCode}`)
        const certiData = {
            certiCode: certificateCode,
            date: await convertToTz({ tz: process.env.Tz, date: new Date(), format: 'DD MMMM YYYY' }),
            courseNm: courseData?.courseId?.title,
            userNm: `${courseData?.userId?.firstName ? `${courseData?.userId?.firstName} ` : ""}${courseData?.userId?.lastName || ""}`,
            qrUrl: qr,
            userId: courseData?.userId?._id,
            instructorLogo: courseData?.courseId?.userId?.profileId?.uri ?? `${process.env.S3_URL}${S3_LOGO_URL.SIGNATURE}` 
        }
        
        const pdfObj = {
            ejsFile: certificateDoc ? certificateDoc?.details : path.join(baseDir, "/public/templates/certificates.ejs"),
            options: {
                height: "776px",
                width: "1060px",
                printBackground: true,
                preferCSSPageSize: true
            }
        }
        await generateWeasyprintPdfAndUpload(pdfObj, certiData).then(async(certificateId) => {
            myLearning.findOneAndUpdate({_id: courseData?._id }, {$set: { certiCode: certificateCode, certiId: certificateId, awardedAt: await convertToTz({ tz: process.env.Tz, date: new Date() }) }}, { new: true })
            .populate('certiId').then()
        })
    } catch (error) {
        logger.error("Error - generateCertificate", error);
    }

}

const generateQRCode = async (scanUrl) => {
    try {
        return await QRCode.toDataURL(scanUrl) 
    } catch (error) {
        logger.error("Error - generateQRCode", error);
    }
}

module.exports = {
    updateProgress,
    coursePercentage,
    certificateQueueFunction,
    generateCertificate,
    updateOrbitProjectCourseProgress
}
