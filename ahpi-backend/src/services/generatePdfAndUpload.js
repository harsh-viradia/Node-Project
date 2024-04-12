const axios = require("axios");
const FormData = require("form-data");
const ejs = require("ejs");
const fs = require('fs');
const https = require('https')
const path = require('path')
const AWS = require("aws-sdk");
const File = require('../components/file/fileModel')
const { FILE_URI, FILE_STATUS } = require('../configuration/constants/fileConstants')
const moment = require('moment-timezone');
const htmlToPdf = require('html-pdf-node')

function stream2buffer(stream) {
  return new Promise((resolve, reject) => {
    const _buf = [];
    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(err));
  });
}

const generatePdfAndUpload = async(pdfObj, replaceFileObj, fileUri) => {
  try {
    const html = await getRenderEjs(pdfObj, replaceFileObj)
    pdfObj.options.args = ['--no-sandbox', '--disable-setuid-sandbox']
    const pdfResult = await htmlToPdf.generatePdf({ content: html }, pdfObj?.options )
    const uploadedData = await uploadToS3AWS(pdfResult, replaceFileObj.userId, fileUri);
    return uploadedData?._id;
  } catch (error) {
    logger.error("Error - generateAndUpload", error);
  }
}


const generateWeasyprintPdfAndUpload = async (pdfObj, replaceFileObj, fileUri) => {
  try {
    const html = await getRenderEjs(pdfObj, replaceFileObj )
    const pdfResult = await generateWeasyPrintPDf({
      html: html,
      images: ["certificate.png"],
      email: replaceFileObj.userNm
    })
    const uploadedData = await uploadToS3AWS(pdfResult, replaceFileObj.userId, fileUri);
    return uploadedData?._id;
  } catch (error) {
    logger.error("Error - generateWeasyprintPdfAndUpload", error);
  }
}


const getRenderEjs = async (pdfObj, replaceFileObj) => {
  try{
    let html, ejsVal = pdfObj?.ejsFile
    if (ejsVal.substr(0, 15) === "<!DOCTYPE html>") {
      html = await ejs.render(pdfObj?.ejsFile, { appUrl: process.env.API_URL, ...replaceFileObj },{async:true});
    } else {
      html = await ejs.renderFile(pdfObj?.ejsFile, { appUrl: process.env.API_URL, ...replaceFileObj });
    }
    return html
  } catch (error){
    logger.error("Error - getRenderEjs", error);
  }
}
const generateWeasyPrintPDf = async (pdfData) => {
  try {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('html', pdfData.html);
      pdfData.images.forEach(image => data.append('asset[]', fs.createReadStream(path.join(__dirname, `../../public/templates/images/${image}`)))
      );
      let req = https.request({
        'method': 'POST',
        'hostname': process.env.PDF_GENERATOR_HOST,
        'path': process.env.PDF_GENERATOR_PATH,
        'headers': {
          ...data.getHeaders()
        },
      });
      req.on('response', async (res) => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(await stream2buffer(res))
        } else {
          logger.error(`Certificate pdf generate api error ${pdfData?.email ? pdfData?.email : ""} ${res.statusCode}`)
          reject(`Certificate pdf generate api error ${pdfData?.email ? pdfData?.email : ""} ${res.statusCode}`)
        }
      });
      req.on('error', (err) => {
        logger.error('Error in weasyprint generate pdf: ' + err);
        reject(err);
      });
      data.pipe(req);
    })
  } catch (error) {
    logger.error("Error - generateWeasyPrintPDf", error)
  }
}

const uploadToS3AWS = async (fileData, userId, fileUri) => {
  try {
    const s3 = new AWS.S3({
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    });

    const unixTimestamp = moment().unix()
    const filePath = fileUri == FILE_URI.INVOICES ? `${FILE_URI.INVOICES}${userId}/Invoice-${unixTimestamp}` : `${FILE_URI.CERTIFICATES}${userId}/Certificate-${unixTimestamp}`

    const response = await s3.upload({
      Bucket: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
      Key: `${filePath}.pdf`,
      ContentType: "application/pdf",
      Body: fileData,
      ACL: "public-read",
      serverSideEncryption: 'AES256',
      cacheControl: 'max-age=1800'
    }).promise();

    const resFileNm = response?.Key.split("/").pop()
    const dataToStore = {
      nm: resFileNm,
      oriNm: resFileNm,
      type: "application/pdf",
      exten: resFileNm?.split(".").pop(),
      mimeType: "application/pdf",
      sts: FILE_STATUS.UPLOADED,
      uri: response.Location,
      createdBy: userId,
    }

    return await File.create(dataToStore);
  } catch (error) {
    logger.error("Error - uploadToS3AWS", error);
  }
};

module.exports = {
  generatePdfAndUpload,
  generateWeasyprintPdfAndUpload
};
