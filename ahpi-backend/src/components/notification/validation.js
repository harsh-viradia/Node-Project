const joi = require("joi")

const create = joi.object({
    nm : joi.string().required(),
    title : joi.string().required(),
    desc : joi.string(),
    imgId : joi.string(),
    btnUrl : joi.string(),
    typeId : joi.string(),
    isShowList : joi.boolean(),
    sendNotification : joi.boolean().default(false),
    startDt : joi.string().allow("", null),
    endDt : joi.string().allow("", null),
    criteriaId: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    userTypeId: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    pages : joi.array().items(
        joi.string().regex(/^[0-9a-fA-F]{24}$/)
    ),
    users : joi.array().items(
        joi.string().regex(/^[0-9a-fA-F]{24}$/)
    ),
    courses : joi.array().items(
        joi.string().regex(/^[0-9a-fA-F]{24}$/)
    ),
    categories : joi.array().items(
        joi.string().regex(/^[0-9a-fA-F]{24}$/)
    ),
    createdBy : joi.optional(),
    updatedBy : joi.optional()
}).unknown(false);

module.exports = {
    create
}