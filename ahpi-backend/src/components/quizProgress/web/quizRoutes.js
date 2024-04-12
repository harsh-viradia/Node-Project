const express = require("express");
const routes = express.Router();
const quizController = require('./quizController')
const quizValidations = require('../quizValidations')

routes.post('/start', authenticate, _checkPermission, validate(quizValidations.startQuiz), quizController.startQuiz);
routes.post('/save-question', authenticate, _checkPermission, validate(quizValidations.saveQuestion), quizController.saveQuestionAnswer);
routes.post('/submit', authenticate, _checkPermission, validate(quizValidations.startQuiz), quizController.submitQuiz);

module.exports = routes;
