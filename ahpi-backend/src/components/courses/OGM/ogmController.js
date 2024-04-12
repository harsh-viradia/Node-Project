
const { purchaseFreeCourse } = require('./ogmService')
const purchaseOGMCourse = catchAsync(async (req, res) => {
  const { courseSlugs } = req.body;
  const result = await purchaseFreeCourse(courseSlugs, req)
  if (result.isCourseAdded == false) {
    res.message = _localize("module.createError", req, "Course");
    return utils.successResponse(result, res);
  }
  res.message = _localize("module.create", req, "Course");
  return utils.successResponse(result, res);
})

module.exports = {
  purchaseOGMCourse
}