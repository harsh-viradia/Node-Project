const pageService = require('../page.service')
const {storeCachingData, setExpireTime, getCachingData} = require("../../../services/redis.service");
const { CASHING_KEY_NAME } = require('../../../configuration/constants/cacheConstants');

//update Page
const getPage = catchAsync(async (req, res) => {
    const result = await pageService.getPage(req.params.slug, req.user, req.query.deviceToken)

    // store Data into Redis and set expiration time. add try catch for avoid to send error
    try {
        await storeCachingData(req.headers[CASHING_KEY_NAME],result)
        // await setExpireTime(req.params.slug, 120)
    } catch (error) {
        logger.error("Error in store caching ", error)
    }
    res.message = _localize("module.get", req, "page");
    return utils.successResponse(result, res)
});

module.exports = {
    getPage
}
