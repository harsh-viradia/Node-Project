const express = require('express')
const routes = express.Router()
const sectionController = require('./sectionController')
const sectionValidator = require('../validations/sectionValidations')

routes.post('/add', authenticate, _checkPermission, validate(sectionValidator.create), sectionController.createSection).descriptor("admin.courses.createSections");
routes.put('/update/:id', authenticate, _checkPermission, validate(sectionValidator.update), sectionController.updateSection).descriptor("admin.courses.updateSections");
routes.delete('/delete', authenticate, _checkPermission, sectionController.deleteSection).descriptor("admin.courses.deleteSections");
routes.put('/update/sequence/:id', authenticate, _checkPermission, validate(sectionValidator.updateSequence), sectionController.updateSequence).descriptor("admin.courses.updateSequenceSections");
routes.post('/', authenticate, _checkPermission, sectionController.listSections).descriptor("admin.courses.getAllSections");

module.exports = routes;