const dbService = require("../../services/db.service");
const seoModel = require("./seoModel");
const seoEntity = require("./seoEntities");
const category = require("../category/categoryModel");
const Page = require('../page/pageModel');

//findSlug.
const slugExist = async ({id, data}) => {
    return seoModel.findOne({slug: slugify(data?.metaTitle), _id: {$ne: id}, deletedAt : { $exists : false }});
}

const createSeo = async (data) => {
    try{        
        if(await slugExist({data}) && data?.slug){
            return { flag : false }
        }
        data.slug = slugify(data?.metaTitle);
        const result = await dbService.createDocument(seoModel, data);
        return {flag: true, data: result};
    } catch (error) {
        logger.error("Error - seoCreate ", error);
        throw new Error(error);
    }
}

//create SeoEntity.
const createEntity = async(data) => {
    try{
        const entityRes = await dbService.createDocument(seoEntity, data)
        return entityRes;
    } catch (error) {
        logger.error("Error - createSeoEntity ", error);
        throw new Error(error);
    }   
}

//update SEO.
const updateSeo = async (id, data) => {
    try {
        if (await slugExist({id, data}) && data?.slug) {
            return {flag: false}
        }
        const seo = {
            metaTitle,
            metaDesc,
            keyWords,
            slug = slugify(data?.metaTitle),
            script,
            author,
            imgId,
            ogTitle,
            ogDesc
        } = data;
        
        const seoEn = {
            entityNm,
            entityId
        } = data;

        const result = await seoModel.findOneAndUpdate({_id: id}, seo, { new : true });
        if(result){
            const id = { seoId : result._id };
            Object.assign(seoEn, id);
            const entityRes = await seoEntity.findOneAndUpdate({ seoId: result._id }, seoEn, { new : true });
            if(entityRes){
                return { flag : true, data : result}
            }
        }
        return { flag : false, data : "specificMsg.emptyData"}
    } catch (error) {
        logger.error("Error - updateSEO", error);
        throw new Error(error)
    }
}

//get seo 
const getSeo = async(type, slug) => {
    try {
        let typeData;
    
        switch(type) {
            case "category" : 
                typeData = await category.findOne({ slug: slug, deletedAt : { $exists: false } });   
                break;
            case "page" : 
                typeData = await Page.findOne({ slug: slug, deletedAt : { $exists: false } });   
                break;
        }

        if(!typeData){
            return { flag : false }
        }

        const seoEnData = await seoEntity.findOne({ entityId: typeData?._id,  deletedAt : { $exists: false } });        
        const query = { _id : seoEnData?.seoId, deletedAt : { $exists: false } };
        const seoData = await dbService.getDocumentByQueryWithPopulate(
                                seoModel, 
                                query, 
                                { path : 'imgId', select : 'uri' }
                            );
        return { flag : true , data : seoData}
    } catch (error) {
        logger.error('Error - getSEO', error)
        throw new Error(error)
    }
}

module.exports = {
    createSeo,
    createEntity,
    updateSeo,
    getSeo
}
