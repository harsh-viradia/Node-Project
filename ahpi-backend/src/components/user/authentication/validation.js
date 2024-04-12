const joi = require('joi')

const register = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().allow("", null),
    countryCode: joi.string().allow("", null),
    mobNo: joi.string().allow("", null),
    email: joi.string().required(),
    passwords: joi.object({
        pass: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/).error(new Error("Password must contains atleast 1 uppercase 1 lowercase 1 numeric value 1 special character and minimum in 8 length.")).required()
    }).required(),
    designation: joi.object({
        state: joi.string().required(),
        place: joi.string().required(),
        department: joi.string().required()
    }).required()
}).unknown(false)

const login = joi.object({
    email : joi.string().required(),
    password: joi.string().required()
}).unknown(false)

module.exports = {
    register,
    login
}