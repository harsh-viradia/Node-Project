const joi = require("joi");

const create = joi.object({
    name: joi.string().required(),
    createdBy: joi.object().optional(),
    updatedBy: joi.object().optional()
  })
  .unknown(false);

const update = joi.object({
    name: joi.string().required(),
    updatedBy: joi.object().optional(),
  })
  .unknown(false);

  module.exports = {
    create,
    update
  }
