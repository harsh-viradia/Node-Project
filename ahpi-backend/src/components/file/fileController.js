const dbService = require("../../services/db.service");
const File = require("./fileModel");
const fileData = require("./fileService");
const fs = require("fs");
const path = require("path");
const { FILE_STATUS } = require("../../configuration/constants/fileConstants");
const {
  setConfig,
  createSignedUrls,
  completeMultipartUpload,
} = require("@knovator/file-uploader-node");
const { exec } = require("child_process");
const AWS = require("aws-sdk");
const redis = require('redis');
const { REDIS } = require('../../configuration/config');
const client = redis.createClient({
    url: `redis://${REDIS.USER}${REDIS.PASSWORD}${REDIS.HOST}:${REDIS.PORT}`,
    legacyMode: true
});
client.connect().then(() => {
  logger.info("Redis Connected 🍺🍻")
})
setConfig({
  bucketName: process.env.AWS_S3_PRIVATE_BUCKET_NAME,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  keyPairId: process.env.AWS_KEY_PAIR_ID,
  privateKey: "",
  signedCookieExpiry: process.env.COOKIE_EXPIRY,
});

const fileUpload = catchAsync(async (req, res) => {
  if (req.files?.length) {
    let result = [];
    const files = req.files;
    await Promise.all(
      _.map(files, async (file) => {
        const data = await fileData(req.user?._id, file);
        if (!data.flag) {
          throw new Error(_localize(data.data, req));
        }
        result.push(await dbService.createDocument(File, data.data));
      })
    );
    res.message = _localize("file.upload", req);
    return utils.createdDocumentResponse(result, res);
  }
  return utils.failureResponse(
    {
      message: _localize("file.fileNotUploaded", req),
    },
    res
  );
});
const getVideoUrl = async (req, res) => {
  try {
    const { parts, object_name } = req.body;
    const result = await createSignedUrls(object_name, parts);
    res.message = _localize("module.generate_url", req, "file");
    return utils.successResponse(result, res);
  } catch (error) {
    throw new Error(error);
  }
};
const completeUpload = async (req, res) => {
  try {
    const { uploadId, parts, object_name } = req.body;
    await completeMultipartUpload(uploadId, object_name, parts);
    let videoObject = {
      folderNm: object_name.split(".")[0],
      status: FILE_STATUS.PROCESSING,
      uploadId: uploadId,
    };
    const data = {
      nm: object_name,
      vidObj: videoObject,
    };
    const result = await File.create(data);
    res.message = _localize("file.upload", req);
    utils.successResponse(result, res);
    await storeDataInRedis(result)
  } catch (error) {
    throw new Error(error);
  }
};
const storeDataInRedis = async (fileData)=>{
  try{
    client.get('videoData', (err, data) => {
      logger.error(`err: ${err}`);
      if(!data){
        data = "[]"
      }
      data = JSON.parse(data)
      data.push({
        fileName: fileData.nm,
        fileId: fileData.id
      })
      const redisUpdateData = JSON.stringify(data);
      client.set('videoData', redisUpdateData);
    })
  }catch(error){
    logger.error(`Error-storeDataInRedis ${error}`)
    throw new Error(error);
  }
}
const videoStream = async (data, result) => {
  try {
    let scriptPath = path.join(
      __dirname,
      "../../scripts/",
      "video-convert-s3.sh"
    );
     let tempPath = path.join(__dirname, '../../temp');
    console.log("🏃🏃 Video script running ", scriptPath);
    let objectNameFolder = data.object_name.split(".")[0];
    let mpdUrl = `${process.env.CLOUDFRONT_URL}/${objectNameFolder}/${objectNameFolder}.mpd`;
    let hslUrl = `${process.env.CLOUDFRONT_URL}/${objectNameFolder}/${objectNameFolder}.m3u8`;
    let mp4Url = `${process.env.CLOUDFRONT_URL}/${objectNameFolder}.mp4`;

    exec(
      `sh ${scriptPath} ${process.env.AWS_S3_PRIVATE_BUCKET_NAME}/${data.object_name} ${process.env.AWS_S3_PRIVATE_BUCKET_NAME} ${tempPath}`,
      async (error, stdout, stderr) => {
        console.log("stdout: ", stdout);
        console.log("stderr: ", stderr);
        if (error !== null) {
          console.log(`exec error: ${error}`);
        } else {
          console.log("Video processing is Completed");
          await File.findOneAndUpdate(
            { _id: result._id },
            {
              "vidObj.status": FILE_STATUS.UPLOADED,
              "vidObj.mpdUrl": mpdUrl,
              "vidObj.hslUrl": hslUrl,
              "vidObj.mp4Url": mp4Url,
            }
          );
        }
      }
    );
    return { flag: true };
  } catch (error) {
    throw new Error(error);
  }
};

let keyPairId = process.env.AWS_KEY_PAIR_ID;

// CODE IS COMMENTED DUE TO NOT USED IN AHPI.
// let privateKey = fs
//   .readFileSync(
//     path.join(
//       __dirname,
//       `../../configuration/s3-cloudfront/${process.env.CLOUDFRONT_PRIVATE_KEY_FILENM}.pem`
//     )
//   )
//   .toString("utf-8");

async function createSignedCookie(resourceUrl = "") {
  return new Promise((resolve, reject) => {
    try {
      let policy = {
        Statement: [
          {
            Resource: resourceUrl,
            Condition: {
              DateLessThan: {
                "AWS:EpochTime": parseInt(process.env.COOKIE_EXPIRY),
              },
            },
          },
        ],
      };
      let policyString = JSON.stringify(policy);

      let signer = new AWS.CloudFront.Signer(keyPairId, privateKey);
      signer.getSignedCookie(
        { url: resourceUrl, policy: policyString },
        function (err, cookie) {
          if (err) reject(err);
          else resolve(cookie);
        }
      );
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  });
}

const getUploadStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await File.findOne({ _id: id }).lean(true);
  if (result.vidObj.status == FILE_STATUS.UPLOADED) {
    let cookies = await createSignedCookie(`${process.env.CLOUDFRONT_URL}/*`);

    let expireAfter = new Date();
    expireAfter.setDate(expireAfter.getDate() + 7);
    Object.keys(cookies).forEach((cookieItemName) => {
      res.cookie(cookieItemName, cookies[cookieItemName], {
        sameSite: "none",
        secure: true,
        domain: process.env.COOKIE_DOMAIN,
        expires: expireAfter,
        httpOnly: true,
        // maxAge: 7200,
      });
    });
    result.vidObj.mp4Url = `Orbit-Skills?Policy=${cookies["CloudFront-Policy"]}&Key-Pair-Id=${cookies["CloudFront-Key-Pair-Id"]}&Signature=${cookies["CloudFront-Signature"]}`;
    // res.header('Access-Control-Allow-Credentials', true)
    // res.header(
    //   'Access-Control-Allow-Headers',
    //   'Origin, X-Requested-With, Content-Type, Accept, CloudFront-Policy, CloudFront-Key-Pair-Id, CloudFront-Signature'
    // )
    // res.header("Access-Control-Allow-Origin", "*")
    res.message = _localize("module.get", req, "File");
    return utils.successResponse(result, res);
  } else {
    return utils.failureResponse("File is not uploaded successfully.", res);
  }
});
const removeFiles = catchAsync(async (req, res) => {
  const filePath = baseDir + "/public";
  const file = await File.findById(req.params.id);
  if (file) {
    let pathRef = file.uri;
    let normPath = path.normalize(`${filePath}${pathRef}`);
    let fileExists = fs.existsSync(normPath);
    if (fileExists) {
      fs.unlinkSync(normPath);
    }
    await File.deleteOne({ _id: req.params.id });
    res.message = _localize("file.remove", req);
    return utils.successResponse({}, res);
  } else {
    res.message = _localize("file.noFileFound", req);
    return utils.failureResponse(res.message, res);
  }
});

const updateData = catchAsync(async(req,res)=>{
  const data = req.body
  await File.updateOne({_id:req.params.id},data)
  res.message = _localize("module.update", req, "File");
  return utils.successResponse({}, res);
})
module.exports = {
  fileUpload,
  removeFiles,
  getVideoUrl,
  completeUpload,
  getUploadStatus,
  updateData
};
