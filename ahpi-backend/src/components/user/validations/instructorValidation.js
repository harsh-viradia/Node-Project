const joi = require("joi");

const createInstructor = joi.object({
    name: joi.string().optional(),
    firstName: joi.string().required(),
    lastName: joi.string().optional().allow("", null),
    countryCode: joi.string(),
    mobNo : joi.number().required(),
    email : joi.string().required(),
    companyNm: joi.string().optional().allow("", null),
    bio : joi.string().required(),
    agreement : joi.object({
        courseLimit : joi.number().required(),
        isApproved : joi.boolean().optional(),
        category : joi.array().items(
            joi.string()
        ).optional(),
        payedPercent: joi.number().required(),
        certificates: joi.array().items(
            joi.string()
        )
    }),
    allCat: joi.boolean().optional(),
    socialLinks : joi.object({
        linkedIn: joi.string().optional().allow(""),
        websiteLink: joi.string().optional().allow(""),
        instaLink: joi.string().optional().allow(""),
        fbLink: joi.string().optional().allow("")
    }).optional(),
    bankDetails: joi.object({
        userAdd: joi.string().required(),
        accNo: joi.string().required(),
        bankNm: joi.string().required(),
        refCode: joi.string().optional(),
        swiftCode: joi.string().required(),
        branchNm: joi.string().required(),
        branchAdd: joi.string().required(),
        branchCode: joi.string().required(),
        cityId: joi.string().optional(),
        cityNm: joi.string().required(),
        countryId: joi.string().optional(),
        countryNm: joi.string().required()
    }),
    profileId: joi.string(),
    createdBy: joi.object(),
    updatedBy: joi.object(),
    deletedBy: joi.object()
}).unknown(false)

const updateInstructor = joi.object({
    name: joi.string().optional(),
    firstName: joi.string(),
    lastName: joi.string().optional().allow(""),
    countryCode: joi.string(),
    mobNo : joi.number().optional(),
    email : joi.string().optional(),
    bio : joi.string().optional(),
    agreement : joi.object({
        courseLimit : joi.number().optional(),
        isApproved : joi.boolean().optional(),
        category : joi.array().items(
            joi.string()
        ).optional(),
        payedPercent: joi.number().optional(),
        certificates: joi.array().items(
            joi.string()
        )
    }),
    allCat: joi.boolean().optional(),
    companyNm: joi.string().optional().allow(""),
    socialLinks : joi.object({
        linkedIn: joi.string().optional().allow(""),
        websiteLink: joi.string().optional().allow(""),
        instaLink: joi.string().optional().allow(""),
        fbLink: joi.string().optional().allow("")
    }).optional(),
    bankDetails: joi.object({
        userAdd: joi.string().required(),
        accNo: joi.string().required(),
        bankNm: joi.string().required(),
        refCode: joi.string().optional(),
        swiftCode: joi.string().required(),
        branchNm: joi.string().required(),
        branchAdd: joi.string().required(),
        branchCode: joi.string().required(),
        cityId: joi.string().optional(),
        cityNm: joi.string().required(),
        countryId: joi.string().optional(),
        countryNm: joi.string().required()
    }),
    profileId: joi.string(),
    createdBy: joi.object(),
    updatedBy: joi.object(),
    deletedBy: joi.object()
}).unknown(false)

module.exports = {
    createInstructor,
    updateInstructor
}