const countryModel = require("../countryModel");
const services = require("../countryServices");

const countryList = catchAsync(async (req, res) => {
  const result = await services.getList(req.body)
  res.message = _localize("module.list", req, "country");
  return utils.successResponse(result, res);
});

const add = catchAsync(async (req, res) => {
  let data = {
    ...req.body,
  };
  let checkCode = await countryModel.findOne({ code: req.body.code, deletedAt: { $exists: false } });
  if (checkCode) {
    message = _localize("module.alreadyExists", req, `${checkCode?.name}`);
    return utils.failureResponse(message, res);
  }
  const result = await services.createCountryService(data);
  res.message = _localize("module.create", req, `${result.name}`);
  return utils.createdDocumentResponse(result, res);
});

const get = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await services.getCountryService(id);
  res.message = _localize("module.get", req, `${result.name}`)
  return utils.successResponse(result, res);
});

const update = catchAsync(async (req, res) => {
  const id = req.params.id;
  let data = {
    ...req.body,
  };
  let checkCode = await countryModel.findOne({ code: req.body.code, deletedAt: { $exists: false }, _id: { $ne: id } });
  if (checkCode) {
    message = _localize("module.alreadyExists", req, `${checkCode?.name}`);
    return utils.failureResponse(message, res);
  }
  const result = await services.updateCountryService(id, data);
  res.message = _localize("module.update", req, `${result.name}`);
  return utils.successResponse(result, res);
});

const softDelete = catchAsync(async (req, res) => {
  const ids = req.body.ids;
  const data = req.body;
  const result = await services.softDeleteCountryService(ids, data);
  if (result.flag) {
    res.message = _localize("module.delete", req, `${result?.data?.name}`);
  } else {
    res.message = _localize("validations.deleteError", req, { "{module}": `${result?.data?.name}`, "{reason}": "not permitted." });
  }
  return utils.successResponse({}, res);
});

const updateActivityStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const result = await countryModel
    .findByIdAndUpdate({ _id: id }, data, {
      new: true,
    });
  if (data.isActive) {
    res.message = _localize("module.activate", req, `${result.name}`);
  } else {
    res.message = _localize("module.deactivate", req, `${result.name}`);
  }
  const resp = {
    name: result.name,
    code: result.code,
    ISOCode2: result.ISOCode2,
    ISOCode3: result.ISOCode3,
    _id: result._id,
    seq: result.seq,
    ISDCode: result.ISDCode
  }
  return utils.successResponse(resp, res);
});

const updateDefault = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  await countryModel.updateOne(
    { isDefault: true },
    { $set: { isDefault: false } }
  );
  const result = await countryModel.findByIdAndUpdate(id, data, { new: true });
  if (data.isDefault === true) {
    res.message = _localize("module.defaultStatusActivate", req, `${result.name}`);
  } else {
    res.message = _localize("module.defaultStatusDeactivate", req, `${result.name}`);
  }
  const resp = {
    name: result.name,
    code: result.code,
    ISOCode2: result.ISOCode2,
    ISOCode3: result.ISOCode3,
    _id: result._id,
    seq: result.seq,
    ISDCode: result.ISDCode
  }
  return utils.successResponse(resp, res);
});

const updateSequence = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { seq } = req.body;
  const result = await services.updateSequenceService(id, seq);
  res.message = _localize("module.updateSequence", req, `${result.name}`);
  return utils.successResponse(result, res);
});

module.exports = {
  countryList,
  add,
  get,
  update,
  softDelete,
  updateActivityStatus,
  updateDefault,
  updateSequence
};
