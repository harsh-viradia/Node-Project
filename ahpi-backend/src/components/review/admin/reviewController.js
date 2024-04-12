const reviewService = require("../review.service")

const getReviewList = catchAsync(async (req, res) => {
    const result = await reviewService.getReviewList(req.body);
    res.message = _localize("module.list", req, "Review");
    return utils.successResponse(result, res);
});

const updateActivityStatus = catchAsync(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const result = await reviewService.updateActiveStatus(id, data);
    if (req.body.isActive) {
        res.message = _localize("module.activate", req, "reviews");
    } else {
        res.message = _localize("module.deactivate", req, "reviews");
    }

    return utils.successResponse(result, res);
});

module.exports = {
    getReviewList,
    updateActivityStatus
}