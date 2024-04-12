const joi = require("joi");

const create = joi
  .object({
    name: joi.string().required(),
    code: joi.string().regex(/^[A-Z0-9_]*$/).required(),
    countryId: joi.string(),
    countryNm: joi.string(),
    canDel: joi.boolean().optional(),
    isActive: joi.boolean().optional(),
    isDefault: joi.boolean().optional(),
    ISOCode2: joi.string().length(2).optional(),
    createdBy: joi.optional(),
    updatedBy : joi.optional()
  })
  .unknown(false);

  const update = joi
  .object({
    name: joi.string().optional(),
    code: joi.string().regex(/^[A-Z0-9_]*$/).optional(),
    countryId: joi.string().optional(),
    countryNm: joi.string().optional(),
    canDel: joi.boolean().optional(),
    isActive: joi.boolean().optional(),
    isDefault: joi.boolean().optional(),
    ISOCode2: joi.string().length(2).optional(),
    updatedBy: joi.object().optional(),
    id: joi.optional()
  })
  .unknown(false);

  const updateSequence = joi
  .object({
      seq: joi.number().optional(),
      updatedBy: joi.object().optional()
  })
  .unknown(false);

module.exports = {
  create,
  update,
  updateSequence
};
