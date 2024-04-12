const service = require("../../../services/db.service");
const htmlTemplate = require("../htmlTemplate.model");

const create = catchAsync(async (req, res) => {
  const data = new htmlTemplate({
    ...req.body,
  });
  let result = await service.createDocument(htmlTemplate, data);
  if (result) {
    res.message = _localize("module.create", req, "emailTemplate");
    return utils.successResponse(result, res);
  } else {
    return utils.failureResponse(_localize("module.already_present", req, "emailTemplate"), res);
  }
});

const update = catchAsync(async (req, res) => {
  const data = {
    ...req.body,
    id: req.params.id,
  };
  const result = await service.findOneAndUpdateDocument(htmlTemplate, {
        _id: data.id,
      },
      data, {
        new: true,
      });
  if (result) {
    res.message = _localize("module.update", req, "emailTemplate");
    return utils.successResponse(result, res);
  } else {
    return utils.failureResponse(_localize("module.update_error", req, "emailTemplate"), res);
  }
});
const view = catchAsync(async (req, res) => {
  let query = {};
  query._id = req.params.id;

  let result = await service.getDocumentByQuery(htmlTemplate, query);

  res.message = _localize("module.getModule", req, "emailTemplate");
  return utils.successResponse(result, res);

});

const destroy = catchAsync(async (req, res) => {
  const id = req.params.id;
  let result = await service.deleteDocument(htmlTemplate, {_id: id, canDel: true})
  if (result) {
    res.message = _localize("module.delete", req, "emailTemplate");
    return utils.successResponse(result, res);
  } else {
    return utils.failureResponse(_localize("module.delete_error", req, "emailTemplate"), res);
  }
});

const findAll = catchAsync(async (req, res) => {
  let options = {};
  let query = {};
  let result;
  if (req.body.isCountOnly) {
    if (req.body.query !== undefined) {
      query = {
        ...req.body.query,
      };
    }
    result = await service.countDocument(htmlTemplate, query);
    if (result) {
      result = {
        totalRecords: result,
      };
      return utils.successResponse(result, res);
    }
    return utils.recordNotFound([], res);
  } else {
    let query = {};
    if (req.body.options !== undefined) {
      options = {
        ...req.body.options,
      };
    }
    if (req.body.query !== undefined) {
      query = {
        ...req.body.query,
      };
    }
    const result = await service.getAllDocuments(htmlTemplate, query, options);

    res.message = _localize("module.findAll", req, "emailTemplate");
    return utils.successResponse(result, res);
  }
});

const partiallyUpdate = catchAsync(async (req, res) => {
  let data = req.body;
  if (data.isActive === undefined) {
    throw new Error(_localize("validationMessage.isActive_required"));
  }
  data = {
    isActive: data.isActive
  }
  const result = await htmlTemplate.findOneAndUpdate({_id: req.params.id, canDel: true}, data, {new: true})
  if (result) {
    res.message = _localize("module.update", req, "emailTemplate");
    utils.successResponse(result, res);
  } else {
    utils.failureResponse(_localize("module.updateError", req, "emailTemplate"), res);
  }
});

module.exports = {
  create,
  update,
  destroy,
  view,
  findAll,
  partiallyUpdate,
};
