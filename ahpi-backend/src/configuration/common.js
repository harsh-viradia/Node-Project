const moment = require('moment-timezone');
const seriesGenerator = require("../components/common/models/seriesGenerator");
const { RANDOM_PASSWORD_CHAR, PASSWORD_REGEX, SYMBOLS } = require('./constants/authConstant')
const { DATE_TYPES } = require("./constants/analyticsConstants");
const axios = require('axios');
const User = require('../components/user/userModel');
const { ObjectId } = require('mongodb');
const resCode = require("../helper/utils/responseCode");
const { IGNORE_SELECTED_KEYS } = require('./constants/refUpdateConstant');

const convertPaginationResult = (data, pagination, filterCount) => {
  try {
    data = data[0];
    let totalDocs = data.metadata[0] ? data.metadata[0].total : 0;
    let docs = data.docs;
    let limit = pagination.limit;
    let totalPages = Math.ceil(totalDocs / limit) === 0 ? 1 : Math.ceil(totalDocs / limit);
    let page = Math.ceil(pagination.offset / limit) === 0 ? 1 : Math.ceil(pagination.offset / limit) + 1;
    let hasPrevPage = false;
    let prevPage = null;
    let nextPage = null;
    if (page !== 1 && page !== 0) {
      hasPrevPage = true;
      prevPage = page - 1;
    }
    let hasNextPage = false;
    if (page !== totalPages) {
      hasNextPage = true;
      nextPage = page + 1;
    }
    let responseData = {
      data: docs,
      paginator: {
        itemCount: totalDocs,
        offset: pagination.offset,
        perPage: limit,
        pageCount: totalPages,
        currentPage: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prev: prevPage,
        next: nextPage,
        filterCount: filterCount || 0,
      }
    };
    return responseData;
  } catch (error) {
    logger.error('Error - convertPaginationResult', error);
    throw new Error(error);
  }
}

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
};

const randomPasswordGenerator = async () => {
  try {
    let pass
    start = true
    while (start) {
      pass = ''
      for (var i = 1; i <= 8; i++) {
        var char = Math.floor(Math.random() * RANDOM_PASSWORD_CHAR.length + 1);
        if (i == 5) {
          pass += SYMBOLS.ATRATE || "@"
        }
        pass += RANDOM_PASSWORD_CHAR.charAt(char)
      }
      checkPass = PASSWORD_REGEX.test(pass);
      start = false
      if (!checkPass) {
        start = true
      }
    }
    return pass
  } catch (error) {
    throw new Error(error);
  }
}

const ssoRegister = async (data) => {
  try {
    let bodyData = {
      "email": data.email,
      "password": data.passwords.pass,
      "firstName": data.firstName,
      "lastName": data.lastName,
      "mobileNumber": data.mobNo,
      "countryCode": data?.countryCode,
      "redirectUrl": process.env.SSO_FRONT_REDIRECT_URL,
      sendWelcomeMail: false
    }
    const authString = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    const authorization_code = await Buffer.from(authString).toString("base64")
    const options = {
      url: `${process.env.SSO_API_URL}/api/user/register-client-user`,
      headers: {
        'content-Type': 'application/json',
        'authorization-code': authorization_code
      }
    }
    const response = await axios.post(options.url, bodyData, {
      headers: options.headers
    })

    let returnObj = {
      flag: true,
      accountId: response.data.data.accountId
    }

    if (response?.data?.data?.userAlreadyRegistered) {
      returnObj.alreadyReguistered = response?.data?.data?.userAlreadyRegistered
    }
    return returnObj
  } catch (error) {
    logger.error('Error - ssoRegister', error)
    throw new Error(error);
  }
}

const validateUser = ({ user, notValidateRegi = true, notLearner }) => {
  try {
    if (!user.isActive) {
      return { flag: false, errRes: "auth.deActivateUser" }
    }

    if (user.deletedAt) {
      return { flag: false, errRes: "auth.unAuthenticated" }
    }
    if (notValidateRegi && notLearner) if (!user.registrationVerified) return { errRes: "module.notVerify", flag: false, stsCode: resCode.unAuthorizedRequest }
    return { flag: true }
  } catch (error) {
    logger.error("Error - validate User ", error)
    throw new Error(error)
  }
}

const ssoGenerateToken = async (data) => {
  const authString = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
  const authorization_code = await Buffer.from(authString).toString("base64");

  const ssoConfig = {
    url: `${process.env.SSO_API_URL}/api/user/generate-token`,
    headers: {
      "authorization-code": authorization_code,
    },
    data: {
      email: data?.email,
      redirectUrl: process.env.SSO_FRONT_REDIRECT_URL
    },
    method: "POST",
  }
  return await axios(ssoConfig)

}

const ssoUpdateData = async (data) => {
  try {
    let bodyData = {
      "email": data.email,
      "firstName": data.firstName,
      "lastName": data.lastName,
      "mobileNumber": data.mobNo,
      "countryCode": data?.countryCode,
      "redirectUrl": process.env.SSO_FRONT_REDIRECT_URL,
    };
    const authString = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    const authorization_code = await Buffer.from(authString).toString("base64")
    const config = {
      method: 'put',
      url: `${process.env.SSO_API_URL}/api/user/profile-update`,
      headers: {
        'authorization-code': authorization_code,
        'Content-Type': 'application/json',
      },
      data: bodyData
    }
    await axios(config);
  } catch (error) {
    logger.error('Error - ssoUpdateData', error)
    throw new Error(error);
  }
}

const ssoDeleteUser = async (data) => {
  try {
    let users = await User.find({ _id: { $in: data } })
    if (users.length) {
      let emails = users.map((user) => user.email)
      let bodyData = {
        "emails": emails,
        "redirectUrl": process.env.SSO_FRONT_REDIRECT_URL,
      };
      const authString = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
      const authorization_code = await Buffer.from(authString).toString("base64");
      const options = {
        url: `${process.env.SSO_API_URL}/api/user/unregister`,
        headers: {
          'content-Type': 'application/json',
          'authorization-code': authorization_code
        }
      }
      await axios.post(options.url, bodyData, {
        headers: options.headers
      });
    }
  } catch (error) {
    logger.error("Error - ssoDeleteUser", error)
    throw new Error(error)
  }
}

const idGenerator = async (type) => {
  let series = await seriesGenerator.findOneAndUpdate(
    { type: type }, // 1 for order, 2 for transaction, 3 for invoice 4 for certificate, 5 customer id
    { $inc: { startFrom: 1, totalEntry: 1 } },
    { new: true }
  );
  return series.prefix + series.startFrom.toString() + series.suffix;
};


const myCustomLabels = {
  totalDocs: "itemCount",
  docs: "data",
  limit: "perPage",
  page: "currentPage",
  nextPage: "next",
  prevPage: "prev",
  totalPages: "pageCount",
  pagingCounter: "slNo",
  meta: "paginator",
};

const commonProjection = {
  createdAt: 0,
  updatedAt: 0,
  createdBy: 0,
  updatedBy: 0,
  __v: 0,
}

const randomString = async (length, timestamp = false) => {
  try {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    const unixTimestamp = moment().unix()
    const middlePoint = Math.round(length / 2);
    for (let i = length; i > 0; --i) {
      if ((i === middlePoint) && timestamp) {
        result += unixTimestamp;
      } else {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    return result;
  } catch (error) {
    logger.error("Error - randomString", error);
    throw new Error(error);
  }
};

const ssoChangePassword = async (req) => {
  try {
    const data = {
      ...req.body
    }
    const authString = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    const authorization_code = await Buffer.from(authString).toString("base64")
    const options = {
      url: `${process.env.SSO_API_URL}/api/user/change-password`,
      headers: {
        'content-Type': 'application/json',
        'authorization-code': authorization_code,
        lng: req.headers?.lng
      },
      data: data,
      method: "POST",
    }
    return axios(options).then((response) => {
      return { flag: true, response }
    }).catch((error) => {
      logger.error('Error from SSO Password Change: ', error);
      return { flag: false, data: error?.response?.data?.description }
    })
  } catch (error) {
    logger.error('Error - ssoChangePassword', error.response.data.description)
    throw new Error(error.response.data.description);
  }
}

const getMonthBetweenTwoYear = (from, to, data) => {
  const dateArray = [];
  let formatData = data?.dateFormat;
  let currentDate = moment(from).tz(data?.timezone);
  const finalStopDate = moment(to).tz(data?.timezone);
  while (currentDate <= finalStopDate) {
    dateArray.push(DATE_TYPES.WEEK.includes(formatData?.type) ? moment(currentDate).weekday(0).format(formatData?.format) : moment(currentDate).format(formatData?.format));
    currentDate = moment(currentDate).add(1, formatData?.type);
  }
  return dateArray;
}

const convertToObjectId = async (data) => {
  let convertedId = [];
  if (data?.length) {
    await Promise.all(_.map(data, (singleData) => {
      convertedId.push(ObjectId(singleData));
    }));
    return convertedId;
  }
  return []
}

const refDataUpdate = async (data) => {
  try {
      let promises = [];
      for (const [collection, details] of Object.entries(data.collectionDetails)) {
          const model = require(`../components/${details.modelFolderNm}/${details.modelFileNm}`)
          details?.arrayType?.forEach(async (item) => {
              let updateObj = {}
              Object.entries(data.updateData).forEach(([key, value]) => {
                  if (!IGNORE_SELECTED_KEYS.includes(key)) {
                    Object.assign(updateObj, { [`${item}.$.${key}`]: value });
                  }
                });
              promises.push(model.updateMany({ [`${item}.id`]: data.updateData._id, deletedAt: { $exists: false} }, { $set: updateObj }));
          });
          details?.objectType?.forEach(async (item) => {
              let updateObj = {}
              Object.entries(data.updateData).forEach(([key, value]) => {
                  if (!IGNORE_SELECTED_KEYS.includes(key)) {
                    Object.assign(updateObj, { [`${item}.${key}`]: value });
                  }
              });
              promises.push(model.updateMany({ [`${item}.id`]: data.updateData._id, deletedAt: { $exists: false } }, { $set: updateObj }));
          });
      }
      await Promise.all(promises);
  }catch(error){
      logger.error("Error - refDataUpdate", error)
  }
}

const refDataDelete = async (data) => {
  try {
      let promises = [];
      for (const [collection, details] of Object.entries(data.collectionDetails)) {
          const model = require(`../components/${details.modelFolderNm}/${details.modelFileNm}`)
          details?.arrayType?.forEach(async (item) => {
              const updateObj = { $pull: { [item]: { id: data.updateData._id }}}
              promises.push(model.updateMany({ [`${item}.id`]: data.updateData._id, deletedAt: { $exists: false } }, updateObj ));
          });
          details?.objectType?.forEach(async (item) => {
              const updateObj = { $unset: { [item]: { id: data.updateData._id } } }
              promises.push(model.updateMany({ [`${item}.id`]: data.updateData._id, deletedAt: { $exists: false } }, updateObj ));
          });
      }
      await Promise.all(promises);
  } catch (error) {
      logger.error("Error - refDataUpdate", error)
  }
}

module.exports = {
  slugify,
  convertPaginationResult,
  generateOTP,
  idGenerator,
  randomPasswordGenerator,
  ssoRegister,
  ssoGenerateToken,
  ssoUpdateData,
  ssoDeleteUser,
  myCustomLabels,
  commonProjection,
  randomString,
  getMonthBetweenTwoYear,
  convertToObjectId,
  ssoChangePassword,
  validateUser,
  refDataUpdate,
  refDataDelete
};
