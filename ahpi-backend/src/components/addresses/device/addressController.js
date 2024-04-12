const addressService = require('../addressService')

const addAddress = catchAsync(async (req, res) => {
    req.body.userId = req.user.id
    const result = await addressService.addAddress(req.body)
    res.message = _localize("module.create", req, 'address');
    return utils.successResponse(result, res);
})

const updateAddress = catchAsync(async (req, res) => {
    req.body.userId = req.user.id
    const result = await addressService.updateAddress(req.body, req.params.id)
    res.message = _localize("module.update", req, 'address');
    return utils.successResponse(result, res);
})

const getAddress = catchAsync(async (req, res) => {
    const result = await addressService.getAddress(req.params, req.query)
    res.message = _localize("module.get", req, 'address');
    return utils.successResponse(result, res);
})

const deleteAddress = catchAsync(async (req, res) => {
    req.body.userId = req.user.id
    const result = await addressService.deleteAddress(req.body)
    if(_.first(result)) {
        res.message = _localize("module.delete", req, 'address');
        return utils.successResponse({}, res);
    }
    message = _localize("validations.deleteError", req,  {"{module}": `address`, "{reason}": "it is set as default"});
    return utils.failureResponse(message, res);
})

const partialUpdateAddress = catchAsync(async (req, res) => {
    req.body.userId = req.user.id
    const result = await addressService.partialUpdateAddress(req.body, req.params.id)
    res.message = _localize("module.defaultStatusActivate", req, 'address');
    return utils.successResponse({}, res);
})

const addressList = catchAsync(async (req, res) => {
    req.body.query.userId = req.user.id
    const result = await addressService.addressList(req.body)
    res.message = _localize("module.list", req, 'address');
    return utils.successResponse(result, res);
})

module.exports = {
    addAddress,
    updateAddress,
    getAddress,
    deleteAddress,
    partialUpdateAddress,
    addressList
}