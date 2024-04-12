const addressService = require('../addressService')

const addressList = catchAsync(async (req, res) => {
    const result = await addressService.addressList(req.body)
    res.message = _localize("module.list", req, 'address');
    return utils.successResponse(result, res);
})

module.exports = {
    addressList
}