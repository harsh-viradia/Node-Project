const reviewService = require("../review.service")

const createReview = catchAsync(async (req, res) => {
    req.body.userId = req.userId;
    req.body.fullName = req.user.name;
    const result = await reviewService.create(req);
    if(!result.flag) {
        message = result.data
        return utils.failureResponse(message, res);
    }
    res.message = _localize("module.create", req, "Review");
    return utils.successResponse(result.data, res);
});

const getReviewList = catchAsync(async (req, res) => {
    const result = await reviewService.getReviewList(req.body, req.user);
    res.message = _localize("module.list", req, "Review");
    return utils.successResponse(result, res);
});

module.exports = {
    create: createReview,
    getReviewList
}
