const searchServices = require('../searchServices')

const createSearch = catchAsync(async( req, res) => {
    if (req.user) {
        req.body.userId = req.user._id
    }
    const result = await searchServices.createSearch(req.query.deviceToken, req.body)
    return utils.successResponse(result, res);
})
const updateSearch = catchAsync(async( req, res) => {
    if (req.user) {
        req.body.userId = req.user._id
    }
    const result = await searchServices.updateSearch(req.query.deviceToken, req.body, req.params.id)
    return utils.successResponse(result, res);
})

module.exports = {
    createSearch,
    updateSearch
}