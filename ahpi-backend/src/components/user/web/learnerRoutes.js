const express = require('express')
const routes = express.Router()
const learnerController = require('./learnerController')
const learnerValidations = require('../validations/learnerValidations')

routes.put("/update/:id", authenticate, _checkPermission, validate(learnerValidations.update), learnerController.profileUpdate)
routes.put("/soft-delete", authenticate, _checkPermission, learnerController.softLernerDelete)

module.exports = routes;
