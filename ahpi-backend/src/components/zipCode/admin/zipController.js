const zipServices = require("../zipService");

//create zipcode controller
const create = catchAsync ( async (req, res) => {
    const result = await zipServices.create(req.body);
    if(result.flag){
        res.message = _localize("module.create", req, "zipCode")
        return utils.successResponse(result.data, res)
    }
    message = _localize(result.data, req, "zipCode")
    return utils.failureResponse(message, res)
})

//update zipcode controller
const update = catchAsync( async (req, res) => {
    const result = await zipServices.update(req.params.id, req.body);
    if(result.flag){
        res.message = _localize("module.update", req, "zipCode")
        return utils.successResponse(result.data, res)
    }
    message = _localize(result.data, req, "zipCode")
    return utils.failureResponse(message, res)
})

//partial-update/ active-deactive zipcode controller
const partialUpdate = catchAsync( async (req, res) => {
    await zipServices.partialUpdate(req.params.id, req.body);
    if(req.body.isActive)
        res.message = _localize("module.activate", req, "zipCode");
    else
        res.message = _localize("module.deactivate", req, "zipCode");
    
    return utils.successResponse({}, res);
})

//soft-delete zipCode conroller
const softDelete = catchAsync(async (req, res) => {
    const ids = req.body.ids;
    const data = req.body

    await zipServices.softDelete(ids, data);
    res.message = _localize("module.delete", req, "zipCode");
    return utils.successResponse({}, res);
})

//get All searched zipcode data controller
const getSearchedData = catchAsync( async ( req, res ) => {
    const result = await zipServices.getSearchedData(req.body);
    req.message = _localize("module.list", req, "zipCode");
    return utils.successResponse(result, res)
})

//get single document controller.
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
    create,
    update,
    partialUpdate,
    softDelete,
    getSearchedData,
    getsingleDoc
}