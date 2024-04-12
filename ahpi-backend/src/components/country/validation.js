const joi = require("joi");

const create = joi
    .object({
        name: joi.string().required(),
        code: joi.string().regex(/^[A-Z0-9_]*$/).required(),
        ISOCode2: joi.string().length(2).optional(),
        ISOCode3: joi.string().length(3).optional(),
        ISDCode: joi.string().optional(),
        isActive: joi.boolean().optional(),
        isDefault: joi.boolean().optional(),
        createdBy: joi.object().optional(),
        updatedBy : joi.optional()
    })
    .unknown(false);

const paritialUpdate = joi
    .object({
        isActive: joi.boolean().optional(),
        updatedBy: joi.object().optional()
    })
    .unknown(false);

const update = joi
    .object({
        name: joi.string().optional(),
        code: joi.string().regex(/^[A-Z0-9_]*$/).optional(),
        ISOCode2: joi.string().length(2).optional(),
        ISOCode3: joi.string().length(3).optional(),
        ISDCode: joi.string().optional(),
        isActive: joi.boolean().optional(),
        isDefault: joi.boolean().optional(),
        updatedBy: joi.object().optional(),
    })
    .unknown(false);
const updateDefault = joi
    .object({
        isDefault: joi.boolean().optional(),
        updatedBy: joi.object().optional()
    })
    .unknown(false);

const updateSequence = joi
    .object({
        seq: joi.number().optional(),
        updatedBy: joi.object().optional()
    })
    .unknown(false);


module.exports = {
    create,
    updateSequence,
    updateDefault,
    update,
    paritialUpdate
};