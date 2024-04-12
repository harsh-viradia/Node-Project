const multer = require("multer");
const AWS = require('aws-sdk')
const path = require("path");
const multerS3 = require('multer-s3')
const { FILE_URI } = require("../../configuration/constants/fileConstants");

AWS.config.update({
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  ...(process.env.AWS_S3_REGION ? { region: process.env.AWS_S3_REGION } : {})
});
const storage = multerS3({
  s3: new AWS.S3(),
  bucket: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  serverSideEncryption: 'AES256',
  cacheControl: 'max-age=1800',
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    let filePath;
    if (file.originalname.match(/\.(mp4|MP4|webm|WEBM|avi|AVI|MPV|mpv|OGG|M4V|M4P|m4v|m4p)$/)) {
      filePath = FILE_URI.VIDEO;
    } else if(file.originalname.match(/\.(jpg|JPG|jpeg|webp|WEBP|JPEG|png|PNG|svg|SVG|GIF|gif)$/)) {
      filePath = FILE_URI.IMAGE;
    } else {
      filePath = FILE_URI.DOCUMENTS;
    }
    cb(null, filePath + Date.now() + path.extname(file.originalname));
  }
})
const upload = multer({ storage: storage });

module.exports = upload;
