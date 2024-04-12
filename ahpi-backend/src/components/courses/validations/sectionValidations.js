const joi = require('joi')

const create = joi.object({
    nm : joi.string().optional(),
    desc: joi.string().required(),
    userId: joi.string().optional(),
    courseId: joi.string().optional(),
    createdBy: joi.object(),
    updatedBy: joi.object()
}).unknown(false)

const update = joi.object({
    nm : joi.string().optional(),
    desc: joi.string().required(),
    updatedBy: joi.object()
}).unknown(false)

const softDelete = joi.object({
    ids: joi.array(),
    deletedBy: joi.object()
}).unknown(false)

const updateSequence = joi.object({
    seq: joi.number(),
    updatedBy: joi.object()
}).unknown(false)

module.exports = {
    create,
    update,
    softDelete,
    updateSequence
}