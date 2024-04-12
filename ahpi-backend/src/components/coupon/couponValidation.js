const joi = require('joi');

const createUpdateCoupon = joi.object({
    name: joi.string().required(),
    code: joi.string().regex(/[A-Z0-9_]$/).required().error(new Error('Code must be valid. It contains A-Z, 0-9 and underscore(_).')),
    typeId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('typeId must be valid.')),
    appliedDate: joi.string().allow("",null).required(),
    expireDate: joi.string().allow("",null).required(),
    totalUse: joi.number().allow(null).min(0).optional(),
    totalPurchase: joi.number().allow(null).min(0).optional(),
    details: joi.string().allow("",null).optional(),
    discountAmount: joi.number().allow(null).min(0).optional(),
    discountPercentage: joi.number().allow(null).min(0).optional(),
    criteriaId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('criteriaId must be valid.')),
    users : joi.array().items(
        joi.string().regex(/^[0-9a-fA-F]{24}$/)
    ),
    buyCourses : joi.array().items(
        joi.string().regex(/^[0-9a-fA-F]{24}$/)
    ),
    buyCategories : joi.array().items(
        joi.string().regex(/^[0-9a-fA-F]{24}$/)
    ),
    getCourses : joi.array().items(
        joi.string().regex(/^[0-9a-fA-F]{24}$/)
    ),
    getCategories : joi.array().items(
        joi.string().regex(/^[0-9a-fA-F]{24}$/)
    ),
    createdBy : joi.optional(),
    updatedBy : joi.optional()
}).unknown(false);

const applyCoupon = joi.object({
    code: joi.string().regex(/[A-Z0-9_]$/).required().error(new Error('Code must be valid. It contains A-Z, 0-9 and underscore(_).')).required(),
    courses : joi.array().items(
        joi.string().regex(/^[0-9a-fA-F]{24}$/)
    ),
    categories : joi.array().items(
        joi.string().regex(/^[0-9a-fA-F]{24}$/)
    ),
    updatedBy : joi.optional()
}).unknown(false);

module.exports = {
    createUpdateCoupon,
    applyCoupon
}