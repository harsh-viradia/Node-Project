const QuizResult = require('./quizResultModel')
const QuestionAnswer = require('./questionAnswerModel')
const { publishMaterials, draftMaterials  } = require('../courses/materialsModel')
const { publishQuestions, draftQuestions  } = require('../courses/questionsModel')
const { MATERIAL, QUIZ_STS, QUESTION_TYPES, PROGRESS_STS  } = require('../../configuration/constants/courseConstant')
const { commonProjection } = require('../../configuration/common')
const { ObjectId } = require('mongodb')
const {Master} = require('@knovator/masters-node')
const moment = require('moment-timezone')
const questionAnswer = require('./questionAnswerModel')
const quizResult = require('./quizResultModel')
const progressModel = require('../purchased-progress/progress/progressModel')
const myLearningModel = require('../purchased-progress/myLearning/myLearning.model')

const saveQuestionAnswer = async (data) => {
    try {
        const findQuestion = await QuestionAnswer.findOne({ quesId: data?.quesId, userId: data?.userId }).populate('quesId');
        if (!findQuestion) {
            return {flag: false, data: "module.notFound", module: 'question'}
        }
        const userQuiz = await firstOrCreateQuizResult(data);
        if(userQuiz.sts == QUIZ_STS.ATTEMPTED) {
            return {flag: false, data: "module.alreadyCompleted", module: "quiz"}
        }
        
        await getCorrentAnswer(findQuestion, data)
        if (data?.isCorrect) {
            data.marks = findQuestion.quesId.posMark
        }
        const totalTime = await getTotalTime(userQuiz.takenTm, data.takenTm ?? "00:00:00")
        await QuizResult.updateOne({_id: userQuiz._id}, {takenTm: totalTime})
        if (userQuiz?.sts === QUIZ_STS.NOT_ATTEMPTED) {
            await setQuizToOngoing(userQuiz?._id);
        }
        if (findQuestion) {
            if (data.clearRes) {
                delete data.ansIds;
                data["$unset"] = { ansIds: 1 }
                data.sts = QUIZ_STS.NOT_ATTEMPTED
            }
            const totalAnsTime = await getTotalTime(findQuestion.takenTm, data.takenTm ?? "00:00:00")
            await QuestionAnswer.updateOne({_id: findQuestion._id}, {
                ...data, takenTm: totalAnsTime
            });
        } else {
            await QuestionAnswer.create({...data});
        }
        return {flag: true}
    } catch (error) {
        logger.error('Error - saveQuestionAnswer', error)
        throw new Error(error)
    }
}

const assignQuizAndQuestions = async(data) => {
    try {
        const findQuiz = await publishMaterials.findOne({ _id: data?.quizId, type: data?.quizType });
        if (!findQuiz) {
            logger.error('Quiz not found!')
            return false;
        }
        data.secId = findQuiz.secId;
        let isQuizAssigned = await QuizResult.findOne(data);
        if(!isQuizAssigned) {
            isQuizAssigned = await QuizResult.create(data);
        }
        const assignedQuestions = await publishQuestions.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: ["$quizId",ObjectId(data.quizId)]
                    },
                    deletedAt: { $exists: false }
                }
            },
            {
                $addFields: {
                    userId: data?.userId,
                    quesId: "$_id"
                }
            },
            { $sample: { size: findQuiz.viewSetOfQue } },
            {
                $project: {
                    _id: 0
                }
            }
        ]).exec();
        await QuestionAnswer.insertMany(assignedQuestions);
        return isQuizAssigned;
    } catch(error) {
        logger.error('Error - assignQuizAndQuestions', error);
        throw new Error(error);
    }
}

const startQuiz = async (data) => {
    try {
        delete data.createdBy;
        delete data.updatedBy;
        let findQuiz = await QuizResult.findOne(data).select(commonProjection);
        let firstTime
        if ((!findQuiz && data?.quizType == MATERIAL.QUIZ) || (!findQuiz && data?.quizType == MATERIAL.QUIZ_WITH_CERTIFICATE)) {
            // used when 1st material is quiz.                  // used when quiz with certificate.            
            firstTime=true
            findQuiz = await assignQuizAndQuestions(data);
        }
        if(findQuiz && data?.quizType == MATERIAL.QUIZ_WITH_CERTIFICATE){
            // used when quiz with certificate is complete
            if( findQuiz.sts == QUIZ_STS.NOT_ATTEMPTED && (!firstTime)){
                findQuiz = await assignQuizAndQuestions(data);
            }
        }
        const questions = await QuestionAnswer.aggregate([
            {
                $match: {
                    quizId: findQuiz?.quizId,
                    userId: findQuiz?.userId,
                    deletedAt: {
                        $exists: false
                    },
                }
            },
            {
                $lookup: {
                    from: 'publishQuestions',
                    let: { id: "$quesId", ansIds: "$ansIds" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$id"]
                                },
                                deletedAt: { $exists: false }
                            }
                        },
                        {
                            $lookup: {
                                from: 'master',
                                let: { id: "$queType" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$_id", "$$id"]
                                            },
                                            isActive: true,
                                        }
                                    },
                                    {
                                        $project: {
                                            name: 1,
                                            names: 1,
                                            code: 1
                                        }
                                    }
                                ],
                                as: "queType"
                            }
                        }, { $unwind: { path: '$queType', preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: '$opts', preserveNullAndEmptyArrays: true } },
                        {
                            $addFields: {
                                "opts.userAnswer": {
                                    $cond: [{ $in: ["$opts._id", "$$ansIds"] }, true, false]
                                },
                            }
                        },
                        {
                            $group: {
                                _id: "$_id",
                                userId: { $first: "$userId" },
                                courseId: { $first: "$courseId" },
                                secId: { $first: "$secId" },
                                seq: { $first: "$seq" },
                                quizId: { $first: "$quizId" },
                                queType: { $first: "$queType" },
                                ques: { $first: "$ques" },
                                opts: { $push: "$opts" }
                            }
                        },
                        {
                            $project: {
                                ...( findQuiz?.sts !== QUIZ_STS.ATTEMPTED ? {"opts.isAnswer": 0} : {} ),
                                ...commonProjection
                            }
                        },
                    ],
                    as: "quesId"
                }
            }, { $unwind: { path: '$quesId', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    ...( findQuiz?.sts == QUIZ_STS.ATTEMPTED ? {marks: 1, isCorrect: 1} : {} ),
                    quesId: 1,
                    sts: 1,
                    takenTm: 1,
                    userId: 1
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
        if (findQuiz?.sts === QUIZ_STS.NOT_ATTEMPTED) {
            findQuiz = await setQuizToOngoing(findQuiz?._id);
        }
        findQuiz._doc.questions = questions
        return {flag: true, data: findQuiz};
    } catch (error) {
        logger.error('Error - startQuiz', error)
        throw new Error(error)
    }
}

const submitQuiz = async (data) => {
    try {
        data.resetQuiz=false;
        await calculateMarksAndPercentage(data)
        data.sts = data.sts ?? QUIZ_STS.ATTEMPTED
        await QuizResult.findOneAndUpdate({ quizId: data?.quizId, userId: data?.userId, isActive: true }, data, { new: true })
        const quizWithCertificate = await publishMaterials.findOne({ _id: data?.quizId,type:MATERIAL.QUIZ_WITH_CERTIFICATE });
        if(quizWithCertificate){
            if(data.totalMarks < quizWithCertificate.passingScore){
                data.resetQuiz=true;
                await deleteQuizAndResetProgressbar(data);
            }                        
        }
        return true
    } catch (error) {
        logger.error('Error - submitQuiz', error)
        throw new Error(error)
    }
}

const firstOrCreateQuizResult = async (data) => {
    const filter = {
        userId: data?.userId,
        courseId: data?.courseId,
        secId: data?.secId,
        quizId: data?.quizId
    }
    const quizData = await QuizResult.findOne(filter)
    if (quizData) {
        return quizData;
    }
    return QuizResult.create(filter)
}

const setQuizToOngoing = async (id) => {
    return await QuizResult.findOneAndUpdate({_id: id}, { sts: QUIZ_STS.ONGOING }, { new: true })
}

const getTotalTime = async (addTime, totalTime) => {
    const duration = moment.duration(totalTime).add(moment.duration(addTime));
    return moment.utc(duration.as('milliseconds')).format("HH:mm:ss");
}

const getCorrentAnswer = async(findQuestion, data) => {
    if(data.ansIds && data.ansIds.length) {
        const questionType = await Master.findOne({_id: data?.queType, deletedAt:{$exists: false}})
        if (questionType.code === QUESTION_TYPES.MSQ || QUESTION_TYPES.MCQ) {
            let correctAns = []
            await Promise.all(_.each(findQuestion.quesId.opts,async(opt)=>{
                if(opt.isAnswer==true )
                correctAns.push(opt.id)
            }))
            if((_.intersection(correctAns,data.ansIds).length == correctAns.length) && correctAns.length == data.ansIds.length){
                data.isCorrect = true
            }
        }
    }
}

const calculateMarksAndPercentage = async(data) => {
    const userAnswers = await QuestionAnswer.find({ quizId: data?.quizId, userId: data?.userId});
    let correctAnsArray = userAnswers.filter(ans => ans.isCorrect == true);
    data.totalMarks = _.sumBy(correctAnsArray, 'marks')
    data.percentage = correctAnsArray.length==0 ? 0 : Math.round(((correctAnsArray?.length * 100)/ userAnswers?.length) * 100) / 100
}

// quiz with certificate reset course progress (delete progressModel,quizResult,questionAnswer)
const deleteQuizAndResetProgressbar = async(data) => {
    try {
        var dateDelete = await convertToTz({ tz: process.env.TZ, date: new Date() });
        await Promise.all([
            questionAnswer.updateMany({courseId: data?.courseId,quizId: data?.quizId,secId: data?.secId,userId: data?.userId},{$set:{deletedAt: dateDelete,deletedBy:data?.userId}}),
            quizResult.updateMany({courseId: data?.courseId,quizId: data?.quizId,secId: data?.secId,userId: data?.userId},{$inc:{totalAttempts: 1},$set:{sts:QUIZ_STS.NOT_ATTEMPTED,takenTm:"00:00:00"}})
        ]);
    } catch (error) {
        logger.error('Error - deleteQuizAndResetProgressbar', error)
        throw new Error(error)
    }
}

module.exports = {
    saveQuestionAnswer,
    startQuiz,
    submitQuiz,
    assignQuizAndQuestions,
    deleteQuizAndResetProgressbar
}