const { CASHING_KEY_NAME } = require("../../../configuration/constants/cacheConstants");
const { storeCachingData } = require("../../../services/redis.service");
const seoServices = require("../seoServices")

//get api
const getSEO = catchAsync( async (req, res) => {
    const result = await seoServices.getSeo(req.params.type, req.params.slug);
    if (result.flag && result.data !== null){
        //  store seo data into redis
        await storeCachingData(req.headers[CASHING_KEY_NAME],result)
        res.message = _localize("module.get", req,"SEO");
        return utils.successResponse(result.data, res);    
    }
    message = _localize("specificMsg.emptyData", req);
    return utils.failureResponse(message, res)
})

module.exports = {
    getSEO
}
