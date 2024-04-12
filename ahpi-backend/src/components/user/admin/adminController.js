const adminService = require("../services/adminService");
const { ssoChangePassword } = require("../../../configuration/common")

const updateProfile = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await adminService.updateProfile(req.body, id);
    if (result.flag) {
        res.message = _localize("module.update", req, 'profile');
        return utils.successResponse(result.data, res);
    }
    message = _localize("auth.emailExists", req);
    return utils.failureResponse(message, res);
});

const changePassword = catchAsync(async (req, res) => {
    const result = await ssoChangePassword(req);
    if (result?.flag) {
        res.message = _localize("module.update", req, 'password');
        return utils.successResponse(result?.data, res);
    }
    return utils.failureResponse(result?.data, res);
});


module.exports = {
    updateProfile,
    changePassword
}
