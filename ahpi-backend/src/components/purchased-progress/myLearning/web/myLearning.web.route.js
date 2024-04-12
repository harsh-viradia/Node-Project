const express = require('express');
const routes = express.Router();
const myLearningWebController = require('./myLearning.web.controller');

routes.post('/', authenticate, _checkPermission,myLearningWebController.listMyLearning);
routes.get('/certificate/:certiCode', myLearningWebController.getCertificate);
routes.post("/updateCertificate", myLearningWebController.updateCertificate)

module.exports = routes;
