const zipServices = require("../zipService");

const getSearchedData = catchAsync( async ( req, res ) => {
    const result = await zipServices.getSearchedData(req.body);
    req.message = _localize("module.list", req, "zipCode");
    return utils.successResponse(result, res)
})

const getsingleDoc = catchAsync( async (req, res ) => {
    const result = await zipServices.getSingleDoc(req.params.id);
    if(result.flag) {
        res.message = _localize("module.list", req, "zipCode");
        return utils.successResponse(result.data, res);
    }
    
    message = _localize(result.data, req, "zipCode");
    return utils.failureResponse(message, res);
})

module.exports = {
    getSearchedData,
    getsingleDoc
}