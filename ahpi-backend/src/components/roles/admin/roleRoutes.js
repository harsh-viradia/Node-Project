const express = require('express')
const routes = express.Router()
const roleController = require('./roleController')
const validator = require('../roleValidations')


routes.post('/create', authenticate, _checkPermission, validate(validator.create), roleController.create).descriptor("admin.roles.create");
routes.post('/list', authenticate, _checkPermission, roleController.getList).descriptor("admin.roles.getAll");
routes.put('/update/:id', authenticate, _checkPermission, validate(validator.update), roleController.update).descriptor("admin.roles.update");
routes.put('/soft-delete', authenticate, _checkPermission, roleController.deleteRole).descriptor("admin.roles.delete");

module.exports = routes;