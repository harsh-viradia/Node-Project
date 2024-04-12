const joi = require("joi");

const create = joi
    .object({
        courses: joi.array().items({
            courseId: joi.string().required(),
            nm: joi.string().required(),
            price: joi.number().required(),
            sellPrice: joi.number().required(),
            earnedRewardsForOrder: joi.number().optional(),
            primaryCat: joi.string().optional(),
        }).required(),
        subTotal: joi.number().required(),
        coupon: {
            couponAmt: joi.number().allow(null).min(0).optional(),
            couponPercent: joi.number().allow(null).min(0).optional(),
            couponCode: joi.string().regex(/[A-Z0-9_]$/).required().error(new Error('Code must be valid. It contains A-Z, 0-9 and underscore(_).')),
            couponType: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('typeId must be valid.')),
        },
        tax: joi.number().required(),
        payMethod:joi.string().optional(),
        currency: joi.string().optional(),
        totalCourses: joi.number().required(),
        grandTotal: joi.number().required(),
        usedRewardsForOrder: joi.number().optional(),
        createdBy: joi.object(),
        updatedBy: joi.object()
    })
    .unknown(false);

module.exports = {
    create
}
