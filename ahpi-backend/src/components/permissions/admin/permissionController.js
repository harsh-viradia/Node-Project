const permissionService = require("../permissionService");

const getPermission = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await permissionService.getPermissionService(id);
  if (result) {
    res.message = _localize("permission.permissionFind", req);
    return utils.successResponse(result, res);
  }
  message = _localize("permission.permissionNotFound", req);
  return utils.failureResponse(message, res)
});

const updatePermission = catchAsync(async (req, res) => {
  const roleId = req.params.id;
  const permissionIds = req.body.permissionIds;
  const result = await permissionService.updatePermissionService(
    roleId,
    permissionIds
  );
  if (result) {
    res.message = _localize("permission.permissionupdate", req);
    return utils.successResponse(result, res);
  } else {
    message = _localize("permission.permissionError", req);
    return utils.failureResponse(message, res);
  }
});

const getPermissionByUser = catchAsync(async (req, res) => {
  let id = req.userId;
  let result = await permissionService.getUserPermission(id);
  if (result) {
    res.message = _localize("module.get", req,"permission");
    utils.successResponse(result, res);
  } else {
    utils.recordNotFound(_localize("module.notFound", req,"permission"), res);
  }
});

module.exports = {
  getPermission,
  updatePermission,
  getPermissionByUser
};
