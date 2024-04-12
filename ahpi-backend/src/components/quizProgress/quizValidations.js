const joi = require("joi");
const { QUIZ_STS } = require('../../configuration/constants/courseConstant')

const startQuiz = joi
    .object({
        courseId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        secId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        quizId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        sts: joi.number().allow(QUIZ_STS.ATTEMPTED).optional(),
        quizType: joi.number().optional(),
        createdBy: joi.object(),
        updatedBy: joi.object()
    }).unknown(false);

const saveQuestion = joi.object({
    courseId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    secId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    quizId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    quesId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    queType: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    sts: joi.number().allow(QUIZ_STS.NOT_ATTEMPTED, QUIZ_STS.ATTEMPTED).required(),
    takenTm: joi.string().required(),
    ansIds: joi.array().optional(),
    clearRes: joi.boolean().optional(),
    createdBy: joi.object(),
    updatedBy: joi.object()
}).unknown(false);

module.exports = {
    startQuiz,
    saveQuestion
}