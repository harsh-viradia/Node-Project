const courseService = require("../services/courseService");
const { draftCourses, publishCourses } = require('../courseModel')
const { STATUS } = require('../../../configuration/constants/courseConstant');
const { setExpireTime } = require("../../../services/redis.service");
const { CASHING_KEY_NAME } = require("../../../configuration/constants/cacheConstants");

const courseBasicInfo = catchAsync(async (req, res) => {
  const result = await courseService.createBasicInfo(req.body);
  if (result.flag) {
    res.message = _localize("module.add", req, "course details");
    return utils.successResponse(result.data, res);
  }
  message = _localize("module.alreadyExists", req, "course");
  return utils.failureResponse(message, res);
});

const courseInfo = catchAsync(async (req, res) => {
  const result = await courseService.createUpdateCourseInfo(req.body, req.params.id);
  if (result.flag) {
    res.message = _localize("module.add", req, "course details");
    return utils.successResponse(result.data, res);
  }
});

const coursePrice = catchAsync(async (req, res) => {
  const result = await courseService.createUpdatePrice(req.body, req.params.id);
  let errMsg = "specificMsg.validPrice"
  if (result.flag) {
    res.message = _localize("module.add", req, "course details");
    return utils.successResponse(result.data, res);
  }
  if(result?.errMsg){
    errMsg = result.errMsg
  }
  message = _localize(errMsg, req);
  return utils.failureResponse(message, res);
});

const courseBasicInfoUpdate = catchAsync(async (req, res) => {
  const result = await courseService.updateBasicInfo(req.params.id, req.body);
  if (result.flag) {
    res.message = _localize("module.add", req, "course details");
    return utils.successResponse(result.data, res);
  }
  message = _localize("module.alreadyExists", req, "course");
  return utils.failureResponse(message, res);
});

const publishCourse = catchAsync(async (req, res) => {
  const result = await courseService.publishCourse(req);
  if(result.flag){
    //  clear course data and section from redis
    // course_${req.headers[CASHING_KEY_NAME]} -> for clear course data
    // section_${req.headers[CASHING_KEY_NAME]} -> for clear section data
    await setExpireTime(`course_${req.headers[CASHING_KEY_NAME]}`,0)
    await setExpireTime(`section_${req.headers[CASHING_KEY_NAME]}`,0)
    res.message = _localize("module.publish", req, result.data);
    return utils.successResponse({}, res);
  }
  message = _localize(result.msg, req,result.data);
  return utils.failureResponse(message, res);
})

const listCourse = catchAsync(async (req, res) => {
  req.body.user = req?.user
  const result = await courseService.getList(req.body, STATUS.draft, draftCourses);
  res.message = _localize("module.list", req, "courses");
  return utils.successResponse(result, res);
})

const softDelete = catchAsync(async (req, res) => {
  const result = await courseService.softDeleteCourse(req.body);
  if(result.flag) {
    res.message = _localize("module.delete", req, "course");
    return utils.successResponse({}, res);
  }
})

const partialUpdate = catchAsync(async (req, res) => {
  const result = await courseService.partialUpdate(req.body, req.params.id);
  if(!result) {
    message = _localize("specificMsg.activateErr", req, "course");
    return utils.failureResponse(message, res);
  }
  res.message = req.body?.isActive ? _localize("module.activate", req, "course") : _localize("module.deactivate", req, "course");
  return utils.successResponse({}, res);
});

const getCourse = catchAsync(async (req, res) => {
  const result = await courseService.getCourse(req, STATUS.draft, draftCourses, [true, false]);
  res.message = _localize("module.get", req, "course");
  return utils.successResponse(result, res);
})


const previewCourseCount = catchAsync(async (req, res) => {
  req.body.user = req?.user;
  const result = await courseService.previewCourseCount(req.body);
  res.message = _localize('module.isApprove', req, 'course')
  return utils.successResponse(result, res);

})

const verifyCourse = catchAsync(async (req, res) => {
  const result = await courseService.verifyCourse(req.params.id, req.user);
  res.message = _localize('module.verified', req)
  return utils.successResponse(result, res);

})

const rejectCourse = catchAsync(async (req, res) => {
  req.body.user = req.user
  const result = await courseService.rejectCourse(req.body, req.params.id);
    res.message = _localize('module.reject',req)
  return utils.successResponse(result, res);

})

const approveCourse = catchAsync(async (req,res) => {
  const result = await courseService.approveCourse(req.params.id);
  res.message = _localize('module.isApprove', req, 'course')
  return utils.successResponse(result, res);
})

const courseCount = catchAsync(async (req, res) => {
  let id = req.body.instructorId
  const countRes = await courseService.courseCount({ id })
  if(countRes.flag == false){
    message = _localize("module.reachedMax", req, "course")
    return utils.failureResponse(message, res)
  }else {
    return utils.successResponse(countRes, res)
  }
  
})

module.exports = {
  courseBasicInfo,
  courseInfo,
  coursePrice,
  courseBasicInfoUpdate,
  publishCourse,
  listCourse,
  softDelete,
  partialUpdate,
  getCourse,
  verifyCourse,
  rejectCourse,
  previewCourseCount,
  approveCourse,
  courseCount
}
