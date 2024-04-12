const joi = require('joi')

const create = joi.object({
    nm: joi.string().required(),
    desc: joi.string().allow(null, ''),
    userId: joi.string().optional(),
    courseId: joi.string().required(),
    secId: joi.string().required(),
    type: joi.number().allow(1, 2, 3, 4, 5).required(),
    vidId: joi.string().optional(),
    viewSetOfQue: joi.number().optional(),
    duration: joi.string().optional(),
    passingScore: joi.number().optional(),
    text: joi.string().optional(),
    docId: joi.string().optional(),
    createdBy: joi.object(),
    updatedBy: joi.object()
}).unknown(false)

const update = joi.object({
    nm: joi.string().required(),
    desc: joi.string().allow(null, ''),
    userId: joi.string().optional(),
    courseId: joi.string().optional(),
    secId: joi.string().optional(),
    type: joi.number().allow(1, 2, 3, 4, 5).optional(),
    vidId: joi.string().optional(),
    viewSetOfQue: joi.number().optional(),
    duration: joi.string().optional(),
    passingScore: joi.number().optional(),
    text: joi.string().optional(),
    docId: joi.string().optional(),
    createdBy: joi.object(),
    updatedBy: joi.object()
}).unknown(false)

const partialUpdate = joi.object({
    seq: joi.number().optional(),
    canDownload: joi.bool().default(false).optional(),
    updatedBy: joi.object()
}).unknown(false)

module.exports = {
    create,
    update,
    partialUpdate
}