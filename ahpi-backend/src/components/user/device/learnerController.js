const learnerService = require('../services/learnerServices')
const { ssoChangePassword } = require("../../../configuration/common")

const profileUpdate = catchAsync(async (req, res) => {
  req.body.email = req.user.email;
  const result = await learnerService.profileUpdate(req.params.id, req.body);
  res.message = _localize("module.update", req, "Profile");
  return utils.successResponse(result, res);
});

const softLernerDelete = catchAsync(async (req, res) => {
  const result = await learnerService.softLernerDelete(req.body.ids);
  res.message = _localize("module.delete", req, 'learner');
  return utils.successResponse(result, res);
})

const changePassword = catchAsync(async (req, res) => {
  const result = await ssoChangePassword(req);
  if (result?.flag) {
      res.message = _localize("module.update", req, 'password');
      return utils.successResponse(result?.data, res);
  }
  return utils.failureResponse(result?.data, res);
});


module.exports = {
    profileUpdate,
  softLernerDelete,
  changePassword
}
