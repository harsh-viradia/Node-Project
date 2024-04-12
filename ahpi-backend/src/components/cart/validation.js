const joi = require("joi");


const updateCart = joi.object({
    courses: joi.array().items(
        joi.string().required()
    ),
    updatedBy: joi.object(),
    createdBy: joi.object()
}).unknown(false);

const removeItemFromCart = joi.object({
    courseId: joi.string().required(),
    updatedBy: joi.object()
}).unknown(false);

module.exports = {
    updateCart,
    removeItemFromCart
}
