const authenticationService = require("./authenticationService")
const resCode = require("../../../helper/utils/responseCode")
const User = require("../userModel")

const registerUser = catchAsync(async (req, res) => {
    const result = await authenticationService.registerUser(req)
    if(!result) {
        message = _localize("auth.failedRegister", req)
        return utils.failureResponse(message, res)
    }
    res.message = _localize("auth.register", req);
    return utils.successResponse({}, res)
})

const login = catchAsync(async(req, res) => {
    const result = await authenticationService.login(req.body)
    if(!result) {
        message = _localize("auth.failedLogin", req)
        return utils.failureResponse(message, res)
    }
    if(!result.flag) {
        res.message = _localize(result.errRes, req, "user")
        if(result.stsCode == resCode.notFound) return utils.userNotFound(res)
        if(result.stsCode == resCode.unAuthorizedRequest) return utils.unAuthorizedRequest(res.message, res)
        return utils.failureResponse(res.message, res)
    }
    res.message = _localize("auth.login", req);
    return utils.successResponse(result.token, res)
})

const changePassword = catchAsync(async(req, res) => {
    const result = await authenticationService.changePassword(req)
    if(!result.flag) {
        res.message = _localize(result?.errRes, req, result?.module ?? "")
        if(result.stsCode == resCode.notFound) return utils.userNotFound(res)
        if(result.stsCode == resCode.unAuthorizedRequest) return utils.unAuthorizedRequest(res.message, res)
        return utils.failureResponse(res.message, res)
    }
    res.message = _localize("module.update", req, "password")
    return utils.successResponse({}, res)
})

const logout = catchAsync(async(req, res) => {
    const fcmToken = req.body.fcmToken
    const deviceToken = req.body.deviceToken
    await User.findByIdAndUpdate({ _id: req.user._id }, { $pull: { fcmToken: fcmToken, deviceToken: deviceToken } , $set : { tokens : [] } });
    res.message = _localize("auth.logout", req)
    return utils.successResponse({}, res)
})

const generateOtp = catchAsync(async(req, res) => {
    const result = await authenticationService.generateOtp(req)
    if(!result.flag) {
        res.message = _localize(result.errRes, req, result.module)
        if(result.stsCode == resCode.notFound) return utils.userNotFound(res)
        if(result.stsCode == resCode.unAuthorizedRequest) return utils.unAuthorizedRequest(res.message, res)
        return utils.failureResponse(res.message, res)
    }
    res.message = _localize("module.send", req, "otp")
    return utils.successResponse({}, res)
})

const updateForgotPass = catchAsync(async(req, res) => {
    const result = await authenticationService.updateForgotPass(req)
    if(!result) {
        message = _localize("module.updateFailed", req, "password")
        return utils.failureResponse(message, res)
    }
    if(!result.flag) {
        res.message = _localize(result.errRes, req, "user")
        if(result.stsCode == resCode.notFound) return utils.userNotFound(res)
        if(result.stsCode == resCode.unAuthorizedRequest) return utils.unAuthorizedRequest(res.message, res)
        return utils.failureResponse(res.message, res)
    }
    res.message = _localize("module.update", req, "password")
    return utils.successResponse({}, res)
})

const validateOtp = catchAsync(async(req, res) => {
    try {
        const result = await authenticationService.validateOtp(req.body)
        if(!result.flag) {
            message = _localize(result.errRes, req, "user")
            return utils.failureResponse(message, res)
        }
        
        res.message = _localize("module.verify", req, "otp")
        return utils.successResponse(result.token, res)
    } catch (error) {
        logger.error("Error - validateOtp ", error)
        throw new Error(error)
    }
})

module.exports = {
    registerUser,
    login,
    changePassword,
    logout,
    generateOtp,
    updateForgotPass,
    validateOtp
}