const joi = require("joi");
const { QUIZ_STS } = require('../../../configuration/constants/courseConstant')

const update = joi.object({
    courseId: joi.string(),
    userId: joi.string(),
    secId: joi.string(),
    totalMaterial: joi.number(),
    materialId: joi.string(),
    nextId: joi.optional(),
    sts: joi.number(),
    playFrom: joi.string(),
    quizObj: joi.object({
        courseId: joi.string().regex(/^[0-9a-fA-F]{24}$/),
        secId: joi.string().regex(/^[0-9a-fA-F]{24}$/),
        quizId: joi.string().regex(/^[0-9a-fA-F]{24}$/),
        sts: joi.number().allow(QUIZ_STS.ATTEMPTED)
    }),
    updatedBy: joi.object()
}).unknown(false);

module.exports = {
    update
}