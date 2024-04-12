const joi = require("joi");
const {WIDGET_TYPE} = require("../../configuration/constants/widgetConstants");

exports.createWidget = joi
    .object({
        name: joi.string().required(),
        type: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        code: joi.string().regex(/[A-Z0-9\_]$/).required().error(new Error('code must be valid.')),
        isMultiTabs: joi.boolean().required(),
        secType: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('section type must be valid.')),
        tabs: joi.array().when('type', {
                is: joi.string().regex(/^[0-9a-fA-F]{24}$/),
                then: joi.array().items(joi.object({
                    type: joi.string().required(),
                    isAlgorithmBase: joi.boolean().required(),
                    name: joi.string().required(),
                    cardType: joi.string().required(),
                    course: joi.array().optional(),
                    categories: joi.array().optional(),
                }))
            }
        ),
        isAutoPlay: joi.boolean().required(),
        headingTitle: joi.string().required(),
        rowPerMobile: joi.number().required(),
        rowPerWeb: joi.number().required(),
        rowPerTablet: joi.number().required(),
        imgType:joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        img: joi.array().when('type', {
                is: joi.string().regex(/^[0-9a-fA-F]{24}$/),
                then: joi.array().items(joi.object({
                    fileId: joi.string().required(),
                    fileIdIndo: joi.string().optional(),
                    link: joi.string().required(),
                    alt: joi.string().required(),
                    altID: joi.string().allow("", null),
                    title: joi.string().required(),
                    titleID: joi.string().allow(null, ""),
                }))
            }
        ),
        reviews: joi.array().optional(),
        createdBy:joi.object(),
        updatedBy:joi.object()
    }).unknown(false);
    
exports.updateWidget = joi
    .object({
        name: joi.string().required(),
        type: joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        code: joi.string().regex(/[A-Z0-9\_]$/).optional().error(new Error('code must be valid.')),
        isMultiTabs: joi.boolean().required(),
        secType: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('section type must be valid.')),
        tabs: joi.array().when('type', {
                is: joi.string().regex(/^[0-9a-fA-F]{24}$/),
                then: joi.array().items(joi.object({
                    type: joi.string().required(),
                    isAlgorithmBase: joi.boolean().required(),
                    name: joi.string().required(),
                    cardType: joi.string().required(),
                    course: joi.array().optional(),
                    categories: joi.array().optional(),
                }))
            }
        ),
        isAutoPlay: joi.boolean().required(),
        headingTitle: joi.string().required(),
        rowPerMobile: joi.number().required(),
        rowPerWeb: joi.number().required(),
        rowPerTablet: joi.number().required(),
        imageType:joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        image: joi.array().when('type', {
                is: joi.string().regex(/^[0-9a-fA-F]{24}$/),
                then: joi.array().items(joi.object({
                    fileId: joi.string().required(),
                    link: joi.string().required(),
                    alt: joi.string().required(),
                    title: joi.string().required(),
                }))
            }
        ),
        reviews: joi.array().optional(),
        updatedBy:joi.object()
    }).unknown(false);