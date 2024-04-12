const joi = require("joi");

const createReview = joi.object({
    courseId: joi.string().required(),
    stars: joi.number().min(1).max(5).required().error(new Error('Rating must be between 1 to 5 stars.')),
    desc: joi.string().allow('').optional(),
    createdBy: joi.object(),
    updatedBy: joi.object()
}).unknown(false);

module.exports = {
    createReview
}
