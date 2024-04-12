const { permit } = require("../components/permissions/permissionService");
const Role = require("../components/roles/roleModel");
let ObjectId = require("mongodb").ObjectId;
const axios = require("axios");
const user = require("../components/user/userModel");
const { unAuthenticated } = require("../helper/utils/messages");
const {
  SSO_REGISTER,
  JWT_STRING,
} = require("../configuration/constants/authConstant");
const { POPULATE } = require('../configuration/constants/userConstant')

async function checkPermission(req, res, next) {
  try {
    if (req.body?.requestType === SSO_REGISTER) {
      return next();
    }
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

async function ssoAuthentication(req, res, next) {
  try {
    const token = req.headers.authorization?.split(JWT_STRING)[1];
    const authString = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
    const authorization_code = await Buffer.from(authString).toString("base64");
    const config = {
      url: `${process.env.SSO_API_URL}/api/auth/verify`,
      headers: {
        "authorization-code": authorization_code,
      },
      data: {
        token: token,
        redirectUrl: process.env.SSO_REDIRECT_URL,
      },
      method: "POST",
    };
    const response = await axios(config).catch((error) => {
      logger.error("Error - userNotAllowedSSO", error);
    });
    let findUser;
    if (response) {
      if (req.body?.requestType === SSO_REGISTER) {
        req.ssoAuth = true;
        return next();
      }
      findUser = await user.findOne({
        email: response?.data?.data?.user?.email,
      }).populate(POPULATE);
    }
    if (findUser) {
      if (findUser?.deletedAt) {
        res.message = req.i18n.t("auth.accountNotFoundEmail");
        return unAuthenticated(res);
      }
      if (findUser?.isActive !== true) {
        res.message = req.i18n.t("auth.userNotAllowed");
        return unAuthenticated(res);
      }
      const firstRole = _.first(findUser?.roles)
      const role = await Role.findOne({ _id: firstRole.roleId });
      if (role?.isActive !== true) {
        res.message = req.i18n.t("auth.userNotAllowed");
        return unAuthenticated(res);
      }
      req.userId = findUser?.id;
      req.user = findUser;
      req.roleIds = findUser?.roles[0].roleId;
    } else {
      res.message = req.i18n.t("auth.unAuthenticated");
      return unAuthenticated(res);
    }
    next();
  } catch (err) {
    logger.error("Error - ssoAuthentication", err);
    throw new Error(err);
  }
}

module.exports = {
  checkPermission,
  ssoAuthentication,
};
