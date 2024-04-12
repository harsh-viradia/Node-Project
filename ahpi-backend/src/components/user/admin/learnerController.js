const learnerService = require('../services/learnerServices')

const list = catchAsync(async (req, res) => {
  req.body.user  = req.user
  const result = await learnerService.getList(req.body);
  res.message = _localize("module.get", req, "Lerner");
  return utils.successResponse(result, res);
});
const getLernerCourseDetails = catchAsync(async (req, res) => {
  const result = await learnerService.getLernerCourseDetails(req.params.id, req.body);
  res.message = _localize("module.get", req, "learner Courses");
  return utils.successResponse(result, res);
});
const partialUpdate = catchAsync(async (req, res) => {
  const result = await learnerService.partialUpdate(req.params.id, req.body);
  if (result.flag && req.body?.isActive) {
    res.message = _localize("module.activate", req, 'learner');
  } else {
    res.message = _localize("module.deactivate", req, 'learner');
  }
  return utils.successResponse({}, res)
});

const softLernerDelete = catchAsync(async (req, res) => {
  const result = await learnerService.softLernerDelete(req.body.ids);
  res.message = _localize("module.delete", req, 'learner');
  return utils.successResponse(result, res);
})


module.exports = {
  list: list,
  getLernerCourseDetails: getLernerCourseDetails,
  partialUpdate: partialUpdate,
  softLernerDelete: softLernerDelete
}
