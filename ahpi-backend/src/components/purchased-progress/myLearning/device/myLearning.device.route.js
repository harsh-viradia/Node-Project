const express = require('express');
const routes = express.Router();
const myLearningDeviceController = require('./myLearning.device.controller');

routes.post('/', authenticate, _checkPermission, myLearningDeviceController.listMyLearning);
routes.get('/certificate/:certiCode', myLearningDeviceController.getCertificate);

module.exports = routes;
