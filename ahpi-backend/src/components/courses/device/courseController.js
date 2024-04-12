const courseService = require('../services/courseService')
const { draftCourses, publishCourses } = require('../courseModel')
const { STATUS } = require('../../../configuration/constants/courseConstant')
const axios = require('axios')
const jwt = require('jsonwebtoken');
const { createInAppsTransactionAndPdf } = require('../../payment/paymentService');
const { storeCachingData } = require('../../../services/redis.service');
const { CASHING_KEY_NAME } = require('../../../configuration/constants/cacheConstants');


const courseList = catchAsync(async (req, res) => {
    req.body.user = req?.user
    req.body.deviceToken = req.query?.deviceToken
    const result = await courseService.getList(req.body, STATUS.publish, publishCourses)
    res.message = _localize("module.list", req, "courses");
    return utils.successResponse(result, res);
})

const courseFilterList = catchAsync(async (req, res) => {
    req.body.user = req?.user
    req.body.deviceToken = req.query?.deviceToken
    const result = await courseService.getFilterList(req.body)
    res.message = _localize("module.list", req, "filters");
    return utils.successResponse(result, res);
})

const getCourse = catchAsync(async (req, res) => {
    let courseModel = req?.query?.isFromAdmin ? draftCourses : publishCourses
    let status = req?.query?.isFromAdmin ? STATUS.draft : STATUS.publish
    const result = await courseService.getCourse(req, status, courseModel);
    res.message = _localize("module.get", req, "course");
    return utils.successResponse(result, res);
})

const getCourseCashing = catchAsync(async (req, res) => {
    let courseModel = req?.query?.isFromAdmin ? draftCourses : publishCourses
    let status = req?.query?.isFromAdmin ? STATUS.draft : STATUS.publish
    const result = await courseService.getCourse(req, status, courseModel);
    if(status == STATUS.publish){
        //  store course data into redis if status is publish
        await storeCachingData(req.headers[CASHING_KEY_NAME],result)
    }
    res.message = _localize("module.get", req, "course");
    return utils.successResponse(result, res);
})

const updateInAppsTransactionIds = catchAsync(async (req, res) => {
    try {
        const token = await courseService.generateInAppsToken();

        const config = {
            url: `${process.env.IN_APPS_API_URL}/inApps/v1/transactions/${req.body.transactionId}`,
            headers: { Authorization: token },
            method: "GET"
        }
        const response = await axios(config);
        if (response?.data?.signedTransactionInfo) {
            const decodeDetails = jwt.decode(response.data.signedTransactionInfo)
            await createInAppsTransactionAndPdf(req, decodeDetails)
            res.message = _localize("module.create", req, "inAppPurchase");
            return utils.successResponse({}, res);
        }else{
            message = _localize("validations.somethingWentWrongError", req,  {"{module}": `transaction create`});
            return utils.failureResponse(message, res);
        }                

    } catch (error) {
        logger.error('Error - updateInAppsTransactionIds ', error)
        let message = _localize("validations.somethingWentWrongError", req,  {"{module}": `in app purchase`});
        if (error?.response?.data?.errorMessage){
            logger.error("Error - axios in-apps",error.response.data.errorMessage)
            message = error.response.data.errorMessage
        }
        return utils.failureResponse(message, res);
    }
})



module.exports = {
    courseList,
    getCourse,
    getCourseCashing,
    updateInAppsTransactionIds,
    courseFilterList
}