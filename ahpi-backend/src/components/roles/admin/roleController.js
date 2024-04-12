const roleService = require("../roleServices");

const create = catchAsync(async (req, res) => {
  const data = {
    ...req.body,
    code: req.body?.name?.toUpperCase().replace(/^[^A-Z0-9]+/, "").replace(/[^A-Z0-9]+$/, "").replace(/\s+/g, "_")
  };
  const result = await roleService.roleCreate(data)
  if (result.flag) {
    res.message = _localize("module.create", req, "role");
    return utils.successResponse(result.data, res);
  } else {
    message = _localize(result.data, req, "role");
    return utils.failureResponse(message, res);
  }
});

const getList = catchAsync(async (req, res) => {
  const result = await roleService.roleList(req);
  res.message = _localize("module.list", req,"roles");
  return utils.successResponse(result, res);
});

const update = catchAsync(async (req, res) => {
  const data = {
    name: req.body.name,
    code: req.body?.name?.toUpperCase().replace(/^[^A-Z0-9]+/, "").replace(/[^A-Z0-9]+$/, "").replace(/\s+/g, "_")
  };
  const result = await roleService.roleUpdate(data, req.params.id);
  if (result.flag) {
    res.message = _localize("module.update", req,"role");
    return utils.successResponse(result.data, res);
  } else {
    message = _localize(result.data, req, "role");
    return utils.failureResponse(message, res);
  }
});

const deleteRole = catchAsync(async (req, res) => {
  await roleService.roleDelete(req.body.ids);
  res.message = _localize("module.delete", req,"role");
  return utils.successResponse({}, res);
});

module.exports = {
  create,
  getList,
  update,
  deleteRole,
};
