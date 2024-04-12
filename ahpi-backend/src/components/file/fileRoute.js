const express = require("express");
const router = express.Router();
const fileController = require("./fileController");
const upload = require("./multer");

router.post('/upload', authenticate, _checkPermission, upload.array("files", process.env.ARRAY_LIMIT), fileController.fileUpload);
router.delete("/remove/:id", authenticate, _checkPermission, fileController.removeFiles);
router.route('/video/urls').post(authenticate,_checkPermission,fileController.getVideoUrl)
router.route('/video/complete').post(authenticate,_checkPermission,fileController.completeUpload)
router.route('/status/:id').get( fileController.getUploadStatus)
router.route('/update/:id').put(fileController.updateData)

module.exports = router;