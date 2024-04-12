const sectionServices = require('../services/sectionService')
const { STATUS } = require('../../../configuration/constants/courseConstant')
const { draftSections, publishSections } = require("../../courses/sectionModel")
const { CASHING_KEY_NAME } = require('../../../configuration/constants/cacheConstants')
const { storeCachingData } = require('../../../services/redis.service')

const getSectionsByCourse = catchAsync(async (req, res) => {
    let coureModel = req?.query?.isFromAdmin ? draftSections : publishSections
    let status = req?.query?.isFromAdmin ? STATUS.draft : STATUS.publish
    const result = await sectionServices.getSectionsByCourse(req, status, coureModel);
    res.message = _localize("module.get", req, "section");
    return utils.successResponse(result, res);
})

const getSectionsByCourseCashing = catchAsync(async (req, res) => {
  let coureModel = req?.query?.isFromAdmin ? draftSections : publishSections
  let status = req?.query?.isFromAdmin ? STATUS.draft : STATUS.publish
  const result = await sectionServices.getSectionsByCourse(req, status, coureModel);
  if(status == STATUS.publish){
    //  store course data into redis if status is publish
    await storeCachingData(req.headers[CASHING_KEY_NAME],result)
  }
  res.message = _localize("module.get", req, "section");
  return utils.successResponse(result, res);
})

module.exports = {
    getSectionsByCourse,
    getSectionsByCourseCashing
}