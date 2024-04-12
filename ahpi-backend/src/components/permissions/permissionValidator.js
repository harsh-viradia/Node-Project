const joi = require("joi");

exports.update = joi
  .object({
    permissionIds: joi.array().items().required(),
    updatedBy: joi.object().optional(),
  })
  .unknown(false);
