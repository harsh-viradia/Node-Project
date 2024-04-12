const UserModel = require("../../components/user/userModel")
const RoleModel = require("../../components/roles/roleModel")
const { POPULATE } = require("../../configuration/constants/userConstant")
const { unAuthenticated } = require("../../helper/utils/messages")
const { permit } = require("../../components/permissions/permissionService")
const { validateUser } = require("../../configuration/common")
const { ObjectId } = require("mongodb")

const fs = require("fs")
const path = require("path")

const jwt = require("jsonwebtoken")
const { ROLE } = require("../../configuration/constants/authConstant")
const publicKey = fs.readFileSync(path.join(baseDir, "./jwt_auth_keys/jwtPublic.key"), 'utf-8').trim()

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1]
        if (!token) {
            logger.error("Error - authenticate please provide user authorization token to proceed next!")
            res.message = _localize("auth.unAuthenticated", req)
            return unAuthenticated(res)
        }

        let isTokenActive
        const decodedToken = jwt.decode(token);
        if (decodedToken) {
            const tokenExpiration = decodedToken.exp * 1000;
            const currentTime = Date.now();

            if (tokenExpiration > currentTime) {
                isTokenActive = true
            } else {
                isTokenActive = false
            }
        }
        if (!isTokenActive) {
            res.message = _localize("auth.unAuthenticated", req)
            return unAuthenticated(res)
        }

        const isTokenVerify = jwt.verify(token, publicKey)
        if (!isTokenVerify) {
            logger.error("Error - authenticate (Token is not valid.).")
            res.message = _localize("auth.unAuthenticated", req)
            return unAuthenticated(res)
        }

        const user = await UserModel.findOne({ "tokens.token": token }).populate(POPULATE)
        if (!user) {
            res.message = _localize("module.notFound", req, "user")
            return unAuthenticated(res)
        }
        const isLearner = user.roles.find(role => {
            return role.roleId.code !== ROLE.LEARNER
        });
        const validationResp = validateUser({ user, notLearner: !isLearner })
        if (!validationResp.flag) {
            res.message = _localize(validationResp.errRes, req, validationResp?.module ?? "")
            return unAuthenticated(res)
        }

        const firstRole = _.first(user?.roles)
        const role = await RoleModel.findOne({ _id: firstRole?.roleId });
        if (!role?.isActive) {
            res.message = req.i18n.t("auth.userNotAllowed");
            return unAuthenticated(res);
        }

        req.user = user
        req.userId = user._id
        req.role = firstRole?.roleId
        next()
    } catch (error) {
        logger.error("Error - authenticate ", error)
        throw new Error(error)
    }
}

async function hasAccess(req, res, next) {
    try {
        const ALLOW_ORIGIN = [
            process.env.ADMIN_URL,
            "http://localhost:5689"
        ]
        let query
        if (req.headers?.authorization) query = { 'tokens.token': req.headers?.authorization }
        else if (req.body.email) query = { email: req.body.email }
        const user = await UserModel.findOne(query).populate(POPULATE)
        if (!user) {
            res.message = _localize("module.notFound", req, "user")
            return utils.userNotFound(res)
        }
        if (ALLOW_ORIGIN.includes(req.headers.origin)) {
            const learnerRole = user.roles.find(role => role.roleId.code == ROLE.LEARNER)
            if (learnerRole) {
                res.message = req.i18n.t("auth.userNotAllowed");
                return unAuthenticated(res);
            }
        }
        next()
    } catch (error) {
        logger.error("Error - hasAccess", error)
        throw new Error(error)
    }
}

async function checkPermission(req, res, next) {
    try {
        const result = await permit(req);
        if (result) {
            const user = req.user;
            const userDetails = (({
                _id,
                name, // need to remove in future
                firstName,
                lastName,
                email,
                mobNo
            }) => ({
                _id: new ObjectId(_id),
                name, //need to remove in future
                email,
                firstName,
                lastName,
                mobNo,
            }))(user);
            if (req.method !== "GET") {
                if (req.method === "POST") {
                    req.body.createdBy = userDetails._id || "";
                } else if (req.method === "PUT") {
                    const softDelete = req.originalUrl.search("soft-delete");
                    if (softDelete !== -1) {
                        req.body.deletedAt = await convertToTz({ tz: req.header.timezone ?? process.env.TZ, date: new Date() }),
                            req.body.deletedBy = userDetails._id || "";
                        req.body.isActive = false;
                    }
                }
                req.body.updatedBy = userDetails._id || "";
            }

            next();
        } else {
            message = req.i18n.t("auth.userNotAllowed");
            return res.status(403).send({ message: message });
        }
    } catch (err) {
        logger.error("Error - checkPermission", err);
        throw new Error(err);
    }
}

module.exports = {
    authenticate,
    checkPermission,
    hasAccess
}
