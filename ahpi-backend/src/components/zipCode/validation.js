const joi = require("joi");

const create = joi.object({
    city : joi.string().required(),
    state : joi.string().required(),
    country : joi.string().required(),
    zipcode : joi.string().required().regex(/^[0-9]{5,10}$/).error(new Error("Zip-code length must in between {5-10}.")),
    createdBy : joi.object(),
    updatedBy : joi.object()
}).unknown(false);


module.exports = {
    create
}