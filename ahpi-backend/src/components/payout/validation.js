const joi = require("joi")

const create = joi.object({
    transferDate: joi.string().required(),
    trnsType: joi.string().required(),
    amt: joi.string().required(),
    month: joi.string().required(),
    user: joi.string().required(),
    currency: joi.string().required(),
    desc: joi.string().optional().allow(""),
    createdBy: joi.object().optional(),
    updatedBy: joi.object().optional()
})

module.exports = {
    create
}