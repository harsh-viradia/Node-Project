const { CASHING_KEY_NAME } = require("../../../configuration/constants/cacheConstants");
const { storeCachingData } = require("../../../services/redis.service");
const categotyService = require("../categoryService");

//get List controller.
const getList = catchAsync(async (req, res) => {
    const result = await categotyService.categoryList(req.body);
    //  store category data into redis
    await storeCachingData(req.headers[CASHING_KEY_NAME],result)
    res.message = _localize("module.list", req, "categories");
    return utils.successResponse(result, res);
});

module.exports = {
    getList
}