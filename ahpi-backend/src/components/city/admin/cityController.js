const cityService = require("../cityServices");
const City = require("../cityModel");

const getList = catchAsync(async (req, res) => {
  const result = await cityService.getList(req.body)
  res.message = _localize("module.list", req, "city");
  return utils.successResponse(result, res);
});

const create = catchAsync(async (req, res) => {
  const data = req.body;
  let checkCode = await City.findOne({ code: req.body.code, deletedAt:{$exists: false} });
  if (checkCode) {
    message = _localize("module.alreadyExists", req, `${checkCode?.name}`);
    return utils.failureResponse(message, res);
  }
  const result = await cityService.createCityService(data);
  res.message = _localize("module.create", req, `${result?.name}`);
  return utils.successResponse(result, res);
});

const update = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  let checkCode = await City.findOne({ code: req.body.code, deletedAt:{$exists: false}, _id : { $ne : id } });
  if (checkCode) {
    message = _localize("module.alreadyExists", req, `${checkCode?.name}`);
    return utils.failureResponse(message, res);
  }
  const result = await cityService.updateCityService(id, data);
  res.message = _localize("module.update", req, `${result?.name}`);
  return utils.successResponse(result, res);
});

const updateActivityStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const result = await cityService.updateActivityStatusCityService(id, data);
  if(req.body.isActive) {
    res.message = _localize("module.activate", req, `${result?.name}`);
  }else{
    res.message = _localize("module.deactivate", req, `${result?.name}`);
  }
  
  return utils.successResponse(result, res);
});

const softDeleted = catchAsync(async (req, res) => {
  const id = req.body.ids;
  const data = req.body;
  const result = await cityService.deleteCityService(id, data);
  if (result.flag) {
    res.message = _localize("module.delete", req, `${result?.data?.name}`);
  } else {
    res.message = _localize("validations.deleteError", req,  {"{module}": `${result?.data?.name}`, "{reason}": "not permitted."});
  }
  return utils.successResponse({}, res);
});

const updateDefaultStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const result = await cityService.updateDefaultStatusCityService(id, data);
  if(data.isDefault) {
    res.message = _localize("module.defaultStatusActivate", req, `${result.name}`);
  }else{
    res.message = _localize("module.defaultStatusDeactivate", req, `${result.name}`);
  }
  
  return utils.successResponse(result, res);
});

const updateSequence = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { seq } = req.body;
  const result = await cityService.updateSequenceService(id, seq);
  res.message = _localize("module.updateSequence", req);
  return utils.successResponse(result, res);
});

module.exports = {
  create,
  update,
  updateActivityStatus,
  softDeleted,
  updateDefaultStatus,
  getList,
  updateSequence
};
