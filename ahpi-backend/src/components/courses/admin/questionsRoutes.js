const express = require('express')
const routes = express.Router()
const questionsController = require('./questionsController')
const questionsValidator = require('../validations/questionsValidations')

routes.post('/add', authenticate, _checkPermission, validate(questionsValidator.create), questionsController.addQuestions).descriptor("admin.courses.createQuestions");
routes.put('/update/:id', authenticate, _checkPermission, validate(questionsValidator.update), questionsController.updateQuestions).descriptor("admin.courses.updateQuestions");
routes.delete('/delete', authenticate, _checkPermission, questionsController.deleteQuestions).descriptor("admin.courses.deleteQuestions");
routes.put('/update/sequence/:id', authenticate, _checkPermission, questionsController.updateSequence).descriptor("admin.courses.updateSequenceQuestions");
routes.post('/', authenticate, _checkPermission, questionsController.listQuestions).descriptor("admin.courses.getAllQuestions");

module.exports = routes;