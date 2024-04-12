const joi = require('joi')

const adminUpdate = joi.object({
    email: joi.string().email().optional().error(new Error('Email must be valid.')),
    name: joi.string().optional(),
    firstName: joi.string().optional(),
    lastName: joi.string().optional().allow(""),
    companyNm: joi.string().optional().allow(""),
    updatedBy: joi.object()
})

module.exports = {
    adminUpdate
}