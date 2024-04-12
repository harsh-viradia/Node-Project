const express = require('express')
const certificateController = require('./certificateController');

const router = express.Router();

router.patch('/partial-update/:id', authenticate, _checkPermission, certificateController.partialUpdate ).descriptor('admin.certificate.partialUpdate');
router.patch('/set-default/:id', authenticate, _checkPermission, certificateController.setDefaultTemplate).descriptor('admin.certificate.default');
router.post('/list', authenticate, _checkPermission, certificateController.list).descriptor('admin.certificate.getAll');
router.post("/get-certificate/:id", certificateController.getCertificate).descriptor('admin.certificate.get')

module.exports = router ;