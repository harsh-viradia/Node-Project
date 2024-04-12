const joi = require("joi");
const create = joi
    .object({
        code: joi
            .string()
            .regex(/[A-Z]$/)
            .required(),
        nm: joi.string().required(),
        subject: joi.string().required(),
        body: joi.string().required(),
        defRecep: joi.array().optional(),
        isActive: joi.boolean().default(true),
        canDel: joi.boolean().default(true),
        createdBy: joi.object(),
        updatedBy: joi.object(),
        deletedBy: joi.object(),
        deletedAt: joi.date(),
        isDelete: joi.boolean().default(false),
        isDeleted: joi.boolean(),
    })
    .unknown(true);


module.exports = {
    create
}