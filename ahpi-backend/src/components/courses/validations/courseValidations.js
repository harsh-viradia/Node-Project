const joi = require('joi')

const basicInfo = joi.object({
    title: joi.string().required(),
    slug: joi.string().regex(/^[a-z0-9\-]*$/).optional().trim().error(new Error("Slug must be valid and includes a-z, 0-9 and '-'.")),
    desc : joi.string().required(),
    lang: joi.string().optional().allow("", null),
    certiPrefix: joi.string().regex(/^[A-Z0-9_/|\-.,:]*$/).optional().error(new Error("Course prefix must be valid and includes A-Z, 0-9 or '_'.")),
    userId: joi.string().required(),
    levelId: joi.string().required(),
    parCategory: joi.array().required(),
    category: joi.array().required(),
    imgId: joi.string().required(),
    createdBy: joi.object(),
    updatedBy: joi.object(),
    certificateId: joi.string().required()
}).unknown(false)

const courseInfo = joi.object({
    briefDesc: joi.string().allow("", null),
    about: joi.string().required(),
    includes: joi.string().required(),
    require: joi.string().required(),
    updatedBy: joi.object()
}).unknown(false)

const coursePrice = joi.object({
    price: joi.object({
        MRP: joi.number().required(),
        sellPrice: joi.number().required(),
        InAppPurchaseSellPrice: joi.number().required(),
        InAppPurchaseMRP: joi.number().required(),
        InAppPurchaseProductId: joi.string().required(),
    }),
    rewardPoints: joi.number().optional().error(new Error("Reward points exceed the limit.")),
    sts: joi.number().optional(),
    updatedBy: joi.object()
}).unknown(false)

module.exports = {
    basicInfo,
    courseInfo,
    coursePrice
}