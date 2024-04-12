const joi = require("joi");

const createPage = joi.object({
    name: joi.string().required(),
    widget: joi.array().items(
        {
            widgetId: joi.string().required(),
            seq: joi.number().required()
        }
    ),
    slug: joi.string().regex(/^[a-z0-9\-]*$/).optional().trim().error(new Error("Slug must be valid and includes a-z, 0-9 and '-'.")),
    createdBy: joi.object(),
    updatedBy: joi.object()
}).unknown(false);

module.exports = {
    createPage
}
