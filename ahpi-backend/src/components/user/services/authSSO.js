const User = require('../userModel')
const Role = require('../../roles/roleModel')
const { ROLE } = require("../../../configuration/constants/authConstant");
const { ObjectId } = require('mongodb')
const { getUserPermission } = require("../../permissions/permissionService");
const { addSubscriber, updateSubscriber } = require('../../../services/novuService');

/**
 * Handle callback from SSO server and add user into our database
 * @type {function(*=, *=, *=): void}
 */
const ssoUserRegister = catchAsync(async (req, res) => {

    if (!req.ssoAuth) {
        res.message = req.i18n.t("auth.unAuthenticated")
        return utils.unAuthenticated(res)
    }
    const result = await ssoUserRegisterService(req.body)
    res.message = _localize("auth.register", req);
    return utils.successResponse({}, res);
})

async function ssoUserRegisterService(data) {
    try {
        let findUser = await User.findOne({ $or: [{ email: data.email }] })
        let findRole = await Role.findOne({ code: ROLE.LEARNER })
        let roles = []
        let user;
        roles.push({ roleId: findRole?._id })
        const userData = {
            _id: ObjectId(data?.accountId),
            firstName: data?.firstName,
            lastName: data?.lastName,
            email: data?.email,
            mobNo: data?.mobileNumber,
            countryCode: data?.countryCode,
            lastLogin : data?.lastLogin
        }
        if (!findUser) {
            userData.roles = roles
            user = await User.create(userData)
            await addSubscriber(user)
        } else {
            delete userData?._id
            user = await User.findOneAndUpdate({ _id: findUser._id }, { $set: userData })
            await updateSubscriber(user)
        }
        return { flag: true }
    } catch (error) {
        throw new Error(error)
    }
}

const getUserProfile = catchAsync(async (req, res) => {
    let user = req.user
    const permissions = await getUserPermission(user._id);
    const result = {
        ...user._doc,
        ...{ permissions }
    }
    delete result.passwords
    delete result.tokens
    res.message = _localize("module.get", req, 'user');
    return utils.successResponse(result, res);
})


module.exports = {
    ssoUserRegister,
    getUserProfile
}