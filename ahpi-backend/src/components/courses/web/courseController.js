const courseService = require('../services/courseService')
const { draftCourses, publishCourses } = require('../courseModel')
const { STATUS } = require('../../../configuration/constants/courseConstant')
const { CASHING_KEY_NAME } = require('../../../configuration/constants/cacheConstants')
const { storeCachingData } = require('../../../services/redis.service')

const courseList = catchAsync(async(req, res) => {
    req.body.user = req?.user
    req.body.deviceToken = req.query?.deviceToken
    const result = await courseService.getList(req.body, STATUS.publish, publishCourses)
    res.message = _localize("module.list", req, "courses");
    return utils.successResponse(result, res);
})

const courseFilterList = catchAsync(async(req, res) => {
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

module.exports = {
    courseList,
    getCourse,
    getCourseCashing,
    courseFilterList
}