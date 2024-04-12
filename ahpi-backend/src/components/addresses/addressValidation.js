const joi = require('joi')

const createAndUpdate = joi.object({
    addrLine1: joi.string().required(),
    addrLine2 : joi.string().allow("", null),
    stateId: joi.string().allow("", null).regex(/^[0-9a-fA-F]{24}$/).required(),
    stateNm: joi.string().required(),
    cityId: joi.string().allow("", null).regex(/^[0-9a-fA-F]{24}$/).required(),
    cityNm: joi.string().required(),
    countryId: joi.string().allow("", null).regex(/^[0-9a-fA-F]{24}$/).required(),
    countryNm: joi.string().required(),
    zipcodeId: joi.string().allow("", null).regex(/^[0-9a-fA-F]{24}$/),
    zipcode: joi.string().min(5).max(10).required(),
    createdBy: joi.object(),
    updatedBy: joi.object()
}).unknown(false)

module.exports = {
    createAndUpdate
}