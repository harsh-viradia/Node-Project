const joi = require('joi')

const create = joi.object({
    userId: joi.string().optional(),
    courseId: joi.string().optional(),
    secId: joi.string().required(),
    quizId: joi.string().required(),
    queType: joi.string().required(),
    ques: joi.string().required(),
    posMark: joi.number().min(0).required(),
    negMark: joi.number().min(0).optional(),
    opts: joi.array().items({
        nm: joi.string().required(),
        seq: joi.number().required(),
        isAnswer: joi.bool().default(false).optional()
    }).required(),
    createdBy: joi.object(),
    updatedBy: joi.object()
}).unknown(false)

const update = joi.object({
    queType: joi.string().optional(),
    ques: joi.string().required(),
    posMark: joi.number().min(0).required(),
    negMark: joi.number().min(0).optional(),
    opts: joi.array().items({
        nm: joi.string().optional(),
        seq: joi.number().optional(),
        isAnswer: joi.bool().default(false).optional()
    }).optional(),
    updatedBy: joi.object()
}).unknown(false)

module.exports = {
    create,
    update
}