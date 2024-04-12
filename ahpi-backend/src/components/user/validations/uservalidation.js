const joi = require("joi");

const createOrUpdateSchema = joi.object({
    firstName: joi.string(),
    lastName: joi.string(),
    countryCode: joi.string(),
    mobNo : joi.number().required(),
    email : joi.string().required(),
    roles: joi.array().items({
        roleId: joi.string().required() 
    }),
    allCat: joi.boolean().optional(),
    createdBy: joi.object(),
    updatedBy: joi.object()
}).unknown(false)

module.exports = {
    createOrUpdateSchema
}