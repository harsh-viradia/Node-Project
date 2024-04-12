const stateService = require("../stateServices");
const State = require("../stateModel");

const getList = catchAsync(async (req, res) => {
  const result = await stateService.getList(req.body)
  res.message = _localize("module.list", req, "Province");
  return utils.successResponse(result, res);
});

const create = catchAsync(async (req, res) => {
  const data = req.body;
  let checkCode = await State.findOne({ code: req.body.code, deletedAt:{$exists: false} });
  if (checkCode) {
    message = _localize("module.alreadyExists", req, `${checkCode?.name}`);
    return utils.failureResponse(message, res);
  }
  const result = await stateService.createStateService(data);
  res.message = _localize("module.create", req, `${result?.name}`);
  return utils.successResponse(result, res);
});

const update = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  let checkCode = await State.findOne({ code: req.body.code, deletedAt:{$exists: false}, _id : { $ne : id } });
  if (checkCode) {
    message = _localize("module.alreadyExists", req, `${checkCode?.name}`);
    return utils.failureResponse(message, res);
  }
  const result = await stateService.updateStateService(id, data);
  res.message = _localize("module.update", req, `${result?.name}`);
  return utils.successResponse(result, res);
});

const updateActivityStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const result = await stateService.updateActivityStatusStateService(id, data);
  if(req.body.isActive){
    res.message = _localize("module.activate", req, `${result?.name}`);
  }else{
    res.message = _localize("module.deactivate", req, `${result?.name}`);
  }
  
  return utils.successResponse(result, res);
});

const softDeleted = catchAsync(async (req, res) => {
  const ids = req.body.ids;
  const data = req.body;
  const result = await stateService.deleteStateService(ids, data);
  if (result) {
    res.message = _localize("module.delete", req, `${result?.data?.name}`);
  } else {
    res.message = _localize("validations.deleteError", req, {"{module}": `${result?.data?.name}`, "{reason}": "not permitted."});
  }
  return utils.successResponse({}, res);
});

const updateDefaultStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const result = await stateService.updateDefaultStatusStateService(id, data);
  if(data.isDefault){
    res.message = _localize("module.defaultStatusActivate", req, `${result.name}`);
  }else{
    res.message = _localize("module.defaultStatusDeactivate", req, `${result.name}`);
  }
  
  return utils.successResponse(result || {}, res);
});

const updateSequence = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { seq } = req.body;
  const result = await stateService.updateSequenceService(id, seq);
  res.message = _localize("module.updateSequence", req, "state");
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
