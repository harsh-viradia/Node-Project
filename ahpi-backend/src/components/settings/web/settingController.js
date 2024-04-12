const settingService = require('../settingService')

const getPage = catchAsync(async (req, res) => {
    const result = await settingService.getPage(req.params?.code)
    res.message = _localize("module.get", req, result?.name);
    return utils.successResponse(result, res);
})

module.exports = {
    getPage
}