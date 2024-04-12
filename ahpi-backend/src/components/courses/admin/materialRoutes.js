const express = require('express')
const routes = express.Router()
const materialController = require('./materialController')
const materialValidator = require('../validations/materialValidations')

routes.post('/add', authenticate, _checkPermission, validate(materialValidator.create), materialController.createMaterial).descriptor("admin.courses.createMaterials");
routes.put('/update/:id', authenticate, _checkPermission, validate(materialValidator.update), materialController.updateMaterial).descriptor("admin.courses.updateMaterials");
routes.delete('/delete', authenticate, _checkPermission, materialController.deleteMaterial).descriptor("admin.courses.deleteMaterials");
routes.put('/partial-update/:id', authenticate, _checkPermission, validate(materialValidator.partialUpdate), materialController.partialUpdate).descriptor("admin.courses.partialUpdateMaterials");
routes.post('/', authenticate, _checkPermission, materialController.listMaterial).descriptor("admin.courses.getAllMaterials");

module.exports = routes;