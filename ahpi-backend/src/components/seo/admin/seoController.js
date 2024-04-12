const { CASHING_KEY_NAME } = require("../../../configuration/constants/cacheConstants");
const { setExpireTime } = require("../../../services/redis.service");
const seoServices = require("../seoServices")

const createSEO = catchAsync(async (req, res) => {
    //seo field data.
    const {metaTitle, metaDesc, keyWords, author, imgId, script, ogTitle, ogDesc, entityNm, entityId} = req.body
    
    const seoResult = await seoServices.createSeo({
        metaTitle,
        metaDesc,
        keyWords,
        script,
        author,
        imgId,
        ogTitle,
        ogDesc
    })

    //soe Entity data
    const seoEntity = {
        entityNm,
        entityId
    }    


    if(seoResult.flag){
        res.message = _localize("module.create", req,"SEO");
        //store seoId to seoEntity.
        const id = { seoId : seoResult.data._id };
        Object.assign(seoEntity, id);
        
        //create seo entity 
        const seoEntityRes = await seoServices.createEntity(seoEntity);
        //  clear seo data from redis for add seo
        await setExpireTime(req.headers[CASHING_KEY_NAME],0)
        if(seoEntityRes){
            return utils.successResponse(seoResult.data, res);
        }
        //return seo entity failure
        message = _localize("module.createError", req,"SEO");
        return utils.failureResponse(message, res);
    }

    //return seo failure
    message = _localize("specificMsg.seoExists", req);
    return utils.failureResponse(message, res);
});

//update seo
const updateSEO = catchAsync(async (req, res) => {
    const seoResult = await seoServices.updateSeo(req.params.id, req.body)
    
    if(seoResult.flag){
        //  clear seo data from redis for update
        await setExpireTime(req.headers[CASHING_KEY_NAME],0)

        res.message = _localize("specificMsg.seoUpdate", req);
        return utils.successResponse(seoResult, res);
    }
    if(!seoResult.flag && seoResult.data === "specificMsg.emptyData"){
        message = _localize(seoResult.data, req,"SEO");
        return utils.failureResponse(message, res);
    }
    message = _localize("specificMsg.seoExists", req);
    return utils.failureResponse(message, res);

})

//get api
const getSEO = catchAsync( async (req, res) => {
    const result = await seoServices.getSeo(req.params.type, req.params.slug);
    if (result.flag && result.data !== null){
        res.message = _localize("module.get", req,"SEO");
        return utils.successResponse(result.data, res);    
    }
    message = _localize("specificMsg.emptyData", req);
    return utils.failureResponse(message, res)
})

module.exports = {
    createSEO,
    updateSEO,
    getSEO
}
