const { publishCourses } = require('../courseModel');
const User = require('../../user/userModel');
const Order = require('../../order/order.model');
const { ORDERSTATUS, SERIES, CURRENCY, STATUS } = require("../../../configuration/constants/paymentConstant");
const { getPaymentStatus } = require('../../payment/paymentService');
const path = require('path');
const { generatePdfAndUpload } = require('../../../services/generatePdfAndUpload');
const orderService = require('../../order/order.service');
const { idGenerator } = require('../../../configuration/common');
const { FILE_URI } = require("../../../configuration/constants/fileConstants");
const TransactionsModel = require('../../payment/paymentModel')
const { addCourseToMyLearning } = require("../../purchased-progress/myLearning/myLearning.service");
const { updateCourseAndCategory } = require("../../widget/widgetServices");
const REMARK_MESSAGE = 'This is system generated transaction used for OGM app.';
const { updateOrbitProjectCourseProgress, certificateQueueFunction } = require('../../purchased-progress/progress/progressServices')
const MyLearning = require("../../purchased-progress/myLearning/myLearning.model");

/**
 * method create order with success status and add to user my learning
 * @param {*} courseIds 
 * @param {*} userId 
 * @returns 
 */
async function purchaseFreeCourse(courseSlugs, req) {
    try {
        const userId = req.userId;
        const orderData = {
            courses: [],
            totalCourses: 0,
            grandTotal: 0,
            subTotal: 0,
            userId,
            sts: ORDERSTATUS.SUCCESS,
            tax: 0,
            createdBy: userId,
            updatedBy: userId
        };
        // create Data got Order
        let courseDetails = await Promise.all(courseSlugs.map(async (courseSlug) => {
            const dbCourse = await publishCourses.findOne({ slug: courseSlug }).populate({
                path:"parCategory imgId",
                select:"name uri"
                });
            if (!dbCourse) {
                return { isCourseAdded:false}
            }
            const isOrderCreated = await Order.findOne({ "user.id": req.userId, "courses.courseId": dbCourse?._id })
            if (isOrderCreated){
                dbCourse.isPurchased = false
                return dbCourse
            }
            orderData.totalCourses++;
            orderData.subTotal = orderData.subTotal + dbCourse.price.sellPrice;
            orderData.courses.push({
                courseId: dbCourse._id,
                nm: dbCourse.title,
                price: dbCourse.price?.sellPrice,
                sellPrice: dbCourse.price?.sellPrice
            })
            return dbCourse
        }));
        if (orderData.courses.length != 0){
            orderData.grandTotal = orderData.subTotal
            // create order
            req.body?.isFromOsc ? Object.assign(orderData, { isFromOsc: true }) : Object.assign(orderData, { isFromOgm: true })
            await orderService.createService({body:{...orderData},user:req.user}).then(data => data.populate('userId addressId'))
            .then((order)=>{
                    User.findOneAndUpdate({_id: order?.userId?._id }, {$inc: { totalPurchaseCourse: order?.totalCourses }}, { new: true }).then(async ()=>{
                    generateOrbitProjectInvoiceAndPdf(order, userId, req)
                    updateCourseAndCategory()
                });
            })
        }
        sendCallbackToOrbitProject(courseDetails, req)

        return courseDetails;
    } catch (error) {
        logger.error("Error - purchaseFreeCourse", error);
        throw new Error(error);
    }
}

const generateOrbitProjectInvoiceAndPdf = async (order, userId,req) => {
    try{
        // get payment status from master
        const master = await getPaymentStatus(STATUS.SETTLEMENT)
        // get new transaction Number from
        const transData = {
            transNo: await idGenerator(SERIES.TRANS),
            amt: order.grandTotal,
            remark: REMARK_MESSAGE,
            stsId: master?._id,
            stsNm: master?.name,
            orderId: order?._id,
            userId: order?.userId?._id,
            currency: CURRENCY.IDR
        }
        // create transaction
        const coursePromise = [TransactionsModel.create(transData)]
        order.courses.map((course) => {
            // add course into my learning
            coursePromise.push(addCourseToMyLearning(course.courseId, userId, req.body))
        })
        await Promise.all(coursePromise)
        const timezone = req.header.timezone || process.env.TZ;
        let invoiceData = {
            invNo: await idGenerator(SERIES.INV),
            date: await convertToTz({ tz: timezone, date: new Date(), format: 'DD-MM-YYYY' }),
            name: order?.userId?.name,
            address: order.addressId ? `${order.addressId?.addrLine1}, ${order.addressId?.addrLine2 ? `${order.addressId?.addrLine2}, ` : ""}${order.addressId?.cityNm}, ${order.addressId?.stateNm}, ${order.addressId?.countryNm} - ${order.addressId?.zipcodeNm}` : '-',
            countryCode: order?.userId?.countryCode,
            phone: order?.userId?.mobNo,
            email: order?.userId?.email,
            courses: order?.courses,
            tax: order?.tax,
            total: order?.grandTotal,
            subTotal: order?.subTotal,
            totalCourses: order?.totalCourses,
            discountCode: order?.discount?.discountCode || "-",
            discountAmt: order?.discount?.discountAmt,
            discountType: order?.discount?.discountType || "-",
            paymentType: transData?.type || "",
            transactionSts: transData?.stsNm || "",
            transNo: transData?.transNo || '-',
            userId: order?.userId?._id,
            coupon_disc: 0,
            reward_points: 0
        }
        const pdfObj = {
            ejsFile: path.join(baseDir, "/public/templates/invoice.ejs"),
            options: {
                format: 'A4',
                printBackground: true,
                preferCSSPageSize: true
            }
        }

        generatePdfAndUpload(pdfObj, invoiceData, FILE_URI.INVOICES).then(async (receiptId) => {
            await Promise.all([
                Order.findOneAndUpdate({ orderNo: order?.orderNo }, { sts: ORDERSTATUS.SUCCESS, receiptId: receiptId, receiptNo: invoiceData?.invNo }, { new: true }),
            ])
        })
    }catch(error){
        logger.error("Error - generateOrbitProjectInvoiceAndPdf", error);
        throw new Error(error);
    }
}
const sendCallbackToOrbitProject = async (courseDetails, req) => {
    try{
        const alreadyPurchasedCourses = courseDetails.filter(item => item.isPurchased == false)
        const data = req.body?.isFromOsc ? { isFromOsc: true } : { isFromOgm: true } 
        if (alreadyPurchasedCourses.length) {
            await Promise.all(alreadyPurchasedCourses.map((dbCourse)=>{

                Order.findOneAndUpdate({ "user.id": req.userId, "courses.courseId": dbCourse?._id }, data).then(() => {
                    MyLearning.findOne({ userId: req?.userId, courseId: dbCourse?._id }).sort({ createdAt: -1 }).then(async (learningProgress) => {
                        let sentObjToOrbitProject = {
                            courseId: dbCourse?._id,
                            courseSlug: dbCourse?.slug,
                            progress: learningProgress?.progress,
                            email: req?.user?.email,
                            isFromOgm: req.body?.isFromOgm,
                            isFromOsc: req.body?.isFromOsc
                        }
                        if (learningProgress?.progress !== 0) {
                            await updateOrbitProjectCourseProgress(sentObjToOrbitProject)
                        }
                        if (learningProgress?.progress === 100) {
                            await certificateQueueFunction(dbCourse, sentObjToOrbitProject)
                        }
                    })
                })
            }))
        }
    }catch(error){
        logger.error("Error - sendCallbackToOrbitProject", error);
        throw new Error(error);
    }
}
module.exports = {
    purchaseFreeCourse
}