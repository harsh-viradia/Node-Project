const couponService = require('../couponService');

const applyCoupon = catchAsync(async(req, res) => {
    req.body = {
        userId: req?.user?.id,
        timezone: req.header.timezone || process.env.TZ,
        deviceToken: req.query?.deviceToken,
        ...req.body
    }
    const result = await couponService.applyCoupon(req.body);
    if(!result.flag) {
        message = _localize(result?.data, req);
        return utils.failureResponse(message, res);
    }
    res.message = _localize("specificMsg.couponApplied", req);
    return utils.successResponse(result?.data, res);
});

module.exports = {
    applyCoupon
}