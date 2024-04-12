const joi = require('joi')

const save = joi.object({
    type: joi.number().allow(1,2).required(), // 1 for save, 2 for view
    userId: joi.string().optional(),
    courseId: joi.string().required(),
    courseNm: joi.string().required(),
    createdBy: joi.object(),
    updatedBy: joi.object()
})

module.exports ={
    save
}