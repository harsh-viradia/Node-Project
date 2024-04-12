const joi = require('joi')

const update = joi.object({
    firstName: joi.string().optional(),
    lastName: joi.string().optional().allow("", null),
    profileId: joi.string().optional(),
    deviceToken: joi.string().optional(),
    fcmToken: joi.string().optional(),
    address: joi.object({
        addrLine1: joi.string().required(),
        addrLine2: joi.string().optional(),
        stateId: joi.string().required(),
        stateNm: joi.string().required(),
        cityId: joi.string().required(),
        cityNm: joi.string().required(),
        countryId: joi.string().required(),
        countryNm: joi.string().required(),
        zipcodeId: joi.string(),
        zipcodeNm: joi.string().required()
    }).optional(),
    designation: joi.object({
        state: joi.string(),
        place: joi.string(),
        department: joi.string()
    }),
    updatedBy: joi.object()
}).unknown(false)

module.exports = {
    update
}