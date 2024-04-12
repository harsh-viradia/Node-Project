const joi = require("joi");

const purchaseFreeCourseValidation = joi.object({
    redirectUrl: joi.string(),
    isFromOgm: joi.boolean(),
    isFromOsc: joi.boolean(),
    courseSlugs: joi.array().items(joi.string()),
    createdBy: joi.object(),
    updatedBy: joi.object()
}).unknown(false);

module.exports = {
    purchaseFreeCourseValidation
}
