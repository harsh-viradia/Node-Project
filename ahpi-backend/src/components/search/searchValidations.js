const joi = require('joi')

const create = joi.object({
    title: joi.string(),
    searchData: joi.object(),
    type: joi.number().allow(1),
    searchResultCount: joi.number(),
    createdBy: joi.object(),
    updatedBy: joi.object()
})

module.exports = {
    create
}