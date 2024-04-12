const express = require('express')
const routes = express.Router()
const adminController = require('./adminController')
const adminValidator = require('../validations/adminValidation')

routes.put('/update/:id', authenticate, _checkPermission, validate(adminValidator.adminUpdate), adminController.updateProfile)

module.exports = routes;
