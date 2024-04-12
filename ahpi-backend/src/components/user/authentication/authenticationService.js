const dbService = require("../../../services/db.service")
const UserModel = require("../userModel")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const moment = require("moment-timezone")
const bcrypt = require('bcrypt')
const path = require("path")

const { validateUser } = require("../../../configuration/common")
const Role = require("../../roles/roleModel")
const { ROLE } = require("../../../configuration/constants/authConstant")
const { emailFunction } = require("../../emails/emailServices")
const { MAIL_EVENT_NAMES } = require("../../../configuration/constants/novu.constant")
const { addSubscriber } = require("../../../services/novuService")
const privateKey = fs.readFileSync(path.join(baseDir, "./jwt_auth_keys/jwtPrivate.key"), 'utf-8').trim()
const resCode = require("../../../helper/utils/responseCode")
const { POPULATE } = require("../../../configuration/constants/userConstant")
const { BCRYPT, ENVIRONMENT } = require("../../../configuration/config")

const generateToken = async (user, remember) => {
    try {
        const expireTime = remember ? process.env.TOKEN_EXPIRE_IN : '3d'
        const jwtSignOptions = {
            algorithm: 'RS256',
            expiresIn: expireTime
        }
        const authToken = jwt.sign(
            { id: user._id, email: user.email },
            privateKey,
            jwtSignOptions
        )
        return {
            authToken, expireTime
        }
    } catch (error) {
        logger.error("Error - generateToken ", error)
        throw new Error(error)
    }
}

const isOtpActive = async (user) => {
    try {
        let currTime = moment()
        let codeTime = moment(user?.otp?.createdAt).add(parseInt(user?.otp.expireTime), "minutes")
        if (currTime.isAfter(codeTime)) {
            return false
        }
        return true
    } catch (error) {
        logger.error("Error - isOtpActive ", error)
        throw new Error(error)
    }
}

const registerUser = async (req) => {
    try {
        const modelKeys = ["email", "mobNo"]
        await dbService.validateDuplicateFields(req.body, modelKeys, UserModel, req)
        hashedPass = bcrypt.hashSync(req.body.passwords.pass, parseInt(BCRYPT.SALT))
        req.body.passwords = { pass: hashedPass, createdAt: moment().toDate() }
        const learnerRole = await Role.findOne({ code: ROLE.LEARNER })
        req.body.roles = { roleId: learnerRole._id }
        const user = await UserModel.create(req.body)
        await addSubscriber(user)
        const otp = await generateOtp(req, registration = true)
        await emailFunction(MAIL_EVENT_NAMES.FORGOT_PASSWORD_OTP, user, { user: user.name, otp: otp.otp, process: "sign-up"})
        return { otp }
    } catch (error) {
        logger.error("Error - registerUser ", error)
        throw new Error(error)
    }
}

const login = async (data) => {
    try {
        const user = await UserModel.findOne({ email: data.email.toLowerCase() }).populate(POPULATE)
        if (!user) {
            return { flag: false, errRes: "module.notFound", module: "user", stsCode: resCode.notFound }
        }
        const passwordMatched = await bcrypt.compare(data.password, user.passwords.pass)
        if (!passwordMatched) {
            return { flag: false, errRes: "auth.passError" }
        }

        const isLearner = user.roles.find(role => {
            return role.roleId.code !== ROLE.LEARNER
        });
        const validationResp = validateUser({ user, notLearner: !isLearner })
        if (!validationResp.flag) {
            return validationResp
        }

        let isTokenActive, updateUser = { lastLogin: moment().toDate() }
        if (user.tokens.length) {
            user.tokens = user.tokens.filter((token) => {
                const decodedToken = jwt.decode(token.token);
                if (decodedToken) {
                    const tokenExpiration = decodedToken.exp * 1000;
                    const currentTime = Date.now();

                    if (tokenExpiration > currentTime) {
                        isTokenActive = true
                        return true;
                    } else {
                        isTokenActive = false
                    }
                }
                return false;
            });

            await user.save()
        }
        if (!isTokenActive) {
            const { authToken, expireTime } = await generateToken(user, data.remember)
            updateUser.$push = {
                tokens: { token: authToken, expire: expireTime }
            }
        }
        const { tokens } = await UserModel.findOneAndUpdate({ _id: user?._id }, updateUser, { new: true })
        return { token: tokens[0].token, flag: true }
    } catch (error) {
        logger.error("Error - login ", error)
        throw new Error(error)
    }
}

const changePassword = async (req) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email.toLowerCase() })
        const isLearner = user.roles.find(role => {
            return role.roleId.code !== ROLE.LEARNER
        });
        const validationResp = validateUser({ user, notLearner: !isLearner })
        if (!validationResp.flag) {
            return validationResp
        }

        const isOldPassMatched = await user.comparePass(req.body.oldPassword)
        if (!isOldPassMatched) {
            const validationResp = { flag: false, errRes: "auth.passError" }
            return validationResp
        }
        const PASS_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/

        if (!PASS_REGEX.test(req.body.newPassword)) return { flag: false, errRes: "auth.passwordWrong" }
        const newPassHash = bcrypt.hashSync(req.body.newPassword, parseInt(BCRYPT.SALT))
        await UserModel.updateOne({ _id: user._id }, { "passwords.pass": newPassHash, "passwords.updatedAt": moment().toDate(), tokens: [] })
        return { flag: true }
    } catch (error) {
        logger.error("Error - changePassword ", error)
        throw new Error(error)
    }
}

const generateOtp = async (req, registration = false) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email.toLowerCase() })
        if (!user) {
            return { flag: false, errRes: "module.notFound", module: "user", stsCode: resCode.notFound }
        }
        const isLearner = user.roles.find(role => {
            return role.roleId.code !== ROLE.LEARNER
        });
        const validationResp = validateUser({ user, notValidateRegi: false, notLearner: !isLearner })
        if (!validationResp.flag) {
            return validationResp
        }
        const isOtpExists = user?.otp?.code
        
        const otp = getOtp(user)
        const otpObj = {
            code: otp,
            createTime: moment().format("HH:mm"),
            createdAt: moment().toDate(),
            expireTime: process.env.OTP_EXPIRE_TIME
        }
        user.otp = otpObj
        await user.save()
        //return otp as of not we are not sending OTP mail, When we send OTP mail, OTP will not send to end user through API.
        !registration && await emailFunction(MAIL_EVENT_NAMES.FORGOT_PASSWORD_OTP, user, { user: user.name, otp, process: req.body?.process ?? "reset-password" })

        return { flag: true, otp }
    } catch (error) {
        logger.error("Error - generateOtp ", error)
        throw new Error(error)
    }
}

const getOtp = (user) => {
    try {
        const len = process.env.OTP_LEN
        let result = "", createTime, currTime, randomNum, seriesGen, randInx
        createTime = new Date(user.createdAt).getTime()
        currTime = Date.now()
        randomNum = Math.ceil((Math.random() * 1000) + 1)
        seriesGen = `${createTime}${currTime}${len}${randomNum}`
        for (index = 0; index < len - 2; index++) {
            randInx = Math.ceil(Math.random() * seriesGen.length) - 1
            result += seriesGen[randInx]
        }
        currTime = String(Date.now())
        result += currTime.substring(currTime.length - 2)
        return result
    } catch (error) {
        logger.error("Error - generateOtp ", error)
        throw new Error(error)
    }
}

const validateOtp = async (data) => {
    try {
        let userOtp
        if (data.otp == process.env.MASTER_OTP) {
            userOtp = await checkOTP(false)
        } else {
            userOtp = await checkOTP(true)
        }

        async function checkOTP(isValid) {
            const user = await UserModel.findOne({ email: data.email.toLowerCase() })
            if (!user) {
                return { flag: false, errRes: "module.notFound", module: "user", stsCode: resCode.notFound }
            }
            const isLearner = user.roles.find(role => {
                return role.roleId.code !== ROLE.LEARNER
            });
            let activeOTP = true
            const validationResp = validateUser({ user, notValidateRegi: false, notLearner: !isLearner })
            if (!validationResp.flag) {
                return validationResp
            }
            const ENVIRONMENT_KEYS = {
                dev: "dev",
                staging: "staging"
            }
            if (isValid) {
                if (data.otp != user?.otp?.code) return { flag: false, errRes: "auth.invalid" }
                activeOTP = await isOtpActive(user)
            } else if (!isValid && !ENVIRONMENT_KEYS[ENVIRONMENT.KEY]) {
                if (data.otp != user?.otp?.code) return { flag: false, errRes: "auth.invalid" }
                activeOTP = await isOtpActive(user)
            }

            let { authToken, expireTime } = await generateToken(user, data?.remember)
            if(!activeOTP) {
                return { errRes: "module.expireOTP", flag: false }
            }
            if (activeOTP && !user.tokens.length) {
                let updateUser = {
                    tokens: { token: authToken, expire: expireTime },
                    lastLogin: moment().toDate(),
                    otp: {}
                }
                if (data?.registrationVerify) {
                    updateUser.registrationVerified = true
                }
                await UserModel.updateOne({ _id: user?._id }, { $set: updateUser })
            } else {
                authToken = user.tokens[0].token
            }
            return { flag: true, authToken }
        }

        if (!userOtp.flag) {
            return userOtp
        }
        return { flag: true, token: userOtp.authToken }
    } catch (error) {
        logger.error("Error - validateOTP ", error)
        throw new Error(error)
    }
}

const updateForgotPass = async (req) => {
    try {

        const isUserAndOtpValidate = await validateOtp(req.body)

        if (!isUserAndOtpValidate.flag) {
            return isUserAndOtpValidate
        }

        const user = await UserModel.findOne({ email: req.body.email?.toLowerCase() })

        if (req.body.otp == process.env.MASTER_OTP) {
            const hashedPass = bcrypt.hashSync(req.body.newPassword, parseInt(BCRYPT.SALT))
            await UserModel.updateOne({ _id: user._id }, { "passwords.pass": hashedPass, "passwords.updatedAt": moment().toDate(), tokens: [] })
            return { flag: true }
        }

        const hashedPass = bcrypt.hashSync(req.body.newPassword, parseInt(BCRYPT.SALT))
        await UserModel.updateOne({ _id: user._id }, { "passwords.pass": hashedPass, "passwords.updatedAt": moment().toDate(), tokens: [] })
        return { flag: true }
    } catch (error) {
        logger.error("Error - updateForgotPass ", error)
        throw new Error(error)
    }
}

module.exports = {
    registerUser,
    login,
    changePassword,
    generateOtp,
    updateForgotPass,
    validateOtp,
    generateToken
}