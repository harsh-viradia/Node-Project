const joi = require("joi");

const createSeo = joi.object({
    metaTitle : joi.string().max(70).required().error(new Error("Meta title length shouldn't more than 70 characters.")),
    metaDesc : joi.string().max(150).required().error(new Error("Meta descrition length shouldn't more than 150 characters.")),
    keyWords : joi.string(),
    script : joi.string().regex(/<script\b[^>]*>([\s\S]*?)<\/script>/).trim().error(new Error("Header should be script tag.")),
    author : joi.string().regex(/^[a-zA-Z\s]*$/).trim().optional().error(new Error("Author Name only take alphabets.")),
    imgId : joi.string(),
    ogTitle : joi.string().max(70).error(new Error("Open Graph title shouldn't be more than 70 characters.")),
    ogDesc : joi.string().max(150).error(new Error("Open Graph description shouldn't be more than 150 characters.")),
    entityNm : joi.string(),
    entityId : joi.string(),
    createdBy : joi.object(),
    updatedBy : joi.object()
}).unknown(false)

const updateSeo = joi.object({
    metaTitle : joi.string().max(70).required().error(new Error("Meta title length shouldn't more than 70 characters.")),
    metaDesc : joi.string().max(150).required().error(new Error("Meta descrition length shouldn't more than 150 characters.")),
    keyWords : joi.string(),
    script : joi.string().regex(/<script\b[^>]*>([\s\S]*?)<\/script>/).trim().error(new Error("Header should be script tag.")),
    author : joi.string().regex(/^[a-zA-Z\s]*$/).trim().optional().error(new Error("Author Name only take alphabets.")),
    imgId : joi.string(),
    ogTitle : joi.string().max(70).error(new Error("Open Graph title should not be more than 70 characters.")),
    ogDesc : joi.string().max(150).error(new Error("Open Graph description should not be more than 150 characters.")),
    entityNm : joi.string(),
    entityId : joi.string(),
    updatedBy : joi.object()
}).unknown(false)

module.exports = {
    createSeo,
    updateSeo
}
