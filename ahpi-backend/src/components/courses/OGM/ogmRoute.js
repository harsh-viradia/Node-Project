const express = require('express')
const routes = express.Router()
const ogmController = require('./ogmController');
const ogmValidate = require('./ogmValidate')
routes.post('/v1/purchase', authenticate, validate(ogmValidate.purchaseFreeCourseValidation), ogmController.purchaseOGMCourse);
module.exports = routes;