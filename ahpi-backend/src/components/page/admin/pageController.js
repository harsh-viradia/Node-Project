const pageService = require('../page.service')

//update Page
const updatePage = catchAsync(async (req, res) => {
    const result = await pageService.updatePage(req.params.id, req.body);
    res.message = _localize("module.update", req, "pages");
    return utils.successResponse(result, res);
});

const getPageList = catchAsync(async (req, res) => {
    const result = await pageService.getPageList(req.body);
    res.message = _localize("module.list", req, "pages");
    return utils.successResponse(result, res);
});
module.exports = {
    updatePage,
    getPageList
}
