const Certificate = require("./certificate.model");
const dbService = require("../../services/db.service");
const ejs = require("ejs");
const user = require("../user/userModel");
const { S3_LOGO_URL } = require("../../configuration/constants/s3Constant")


const partialUpdate = async (data, id) => {
  try {
    const isUpdate = await Certificate.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    if (isUpdate) {
      return { flag: true, data: isUpdate };
    } else {
      return { flag: false };
    }
  } catch (error) {
    logger.error("Error - CertificatepartialUpdate ", error);
    throw new Error();
  }
};

const setDefaultTemplate = async (data, id) => {
  try {
    const findDefault = await Certificate.findOne({ isDefault: true });
    if (findDefault) {
      await Certificate.findOneAndUpdate({ _id: findDefault?._id }, { isDefault: false });
    }
    await Certificate.findOneAndUpdate({ _id: id }, data);
  } catch (error) {
    logger.error("Error - CertificatepartialDefault ", error);
    throw new Error();
  }
};

const getList = async (data) => {
  try {
    let options = {};
    let query = {};
    let filter = {};
    if (data?.query?.filter) {
      data?.query?.filter?.isActive == true ||
        data?.query?.filter?.isActive == false
        ? (filter.isActive = data?.query?.filter?.isActive)
        : "";

      if(data?.query?.filter?.instructorId) {
        const usersCerti = await user.findOne({ _id: data.query.filter.instructorId })
        filter._id = { $in : usersCerti?.agreement?.certificates }
      }
    }
    delete data?.query?.filter;
    if (data?.options) {
      options = {
        ...data.options,
      };
      options.sort = data?.options?.sort
        ? data?.options?.sort
        : { createdAt: -1 };
    }
    if (data?.query) {
      query = {
        ...data.query,
        ...filter,
        deletedAt: { $exists: false },
      };
    }
    const result = await dbService.getAllDocuments(
      Certificate,
      { ...query },
      options
    );
    return result;
  } catch (error) {
    logger.error("Error - certificate getList ", error)
    throw new Error(error)
  }
};

const getCertificate = async(certificateId) => {
    const getCertificateContent = await Certificate.findOne({ _id: certificateId })
    const customCertificateData = { 
      courseNm: "Certified Healthcare Quality Practitioner (CHQP)",
      userNm: "SARA MARYAM",
      date: await convertToTz({ tz: process.env.Tz, date: new Date(), format: 'DD MMMM YYYY' }),
      certiCode: "AIHQ-CHQP-DSM",
      qrUrl: "",
      instructorLogo: `${process.env.S3_URL}${S3_LOGO_URL.SIGNATURE}`
    }

    const renderHtmlContent = ejs.render(getCertificateContent.details, customCertificateData)
    return renderHtmlContent
}

module.exports = {
  partialUpdate: partialUpdate,
  getList: getList,
  setDefaultTemplate: setDefaultTemplate,
  getCertificate
};
