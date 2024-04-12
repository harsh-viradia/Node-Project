const joi = require("joi");

const categoryCreate = joi.object({
    name:joi.string().required(),
    parentCategory:joi.array().items(
        joi.string().optional()
    ),
    image:joi.string().optional(),
    description:joi.string().allow(null, ''),
    topics: joi.array().optional(),
    canDel: joi.bool().default(true).optional(),
    createdBy:joi.object(),
    updatedBy:joi.object()
}).unknown(false);


const categoryUpdate = joi.object({
    name:joi.string().required(),
    parentCategory:joi.array().items(
        joi.string().optional()
    ),
    image:joi.string().optional(),
    topics: joi.array().optional(),
    description:joi.string().allow(null, ''),
    updatedBy:joi.object(),
}).unknown(false);

module.exports = {
    categoryCreate,
    categoryUpdate
}