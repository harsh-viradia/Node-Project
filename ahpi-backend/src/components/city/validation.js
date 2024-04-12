const joi = require("joi");

const create = joi
  .object({
    name: joi.string().required(),
    code: joi.string().regex(/^[A-Z0-9_]*$/).required(),
    stateId: joi.string().required(),
    stateNm: joi.string().required(),
    canDel: joi.boolean().optional(),
    isActive: joi.boolean().optional(),
    isDefault: joi.boolean().optional(),
    createdBy: joi.optional(),
    updatedBy : joi.optional()
  })
  .unknown(false);

  const update = joi
  .object({
    name: joi.string().optional(),
    code: joi.string().regex(/^[A-Z0-9_]*$/).optional(),
    stateId: joi.string().optional(),
    stateNm: joi.string().optional(),
    canDel: joi.boolean().optional(),
    isActive: joi.boolean().optional(),
    isDefault: joi.boolean().optional(),
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
  updateSequence,
  update
};
