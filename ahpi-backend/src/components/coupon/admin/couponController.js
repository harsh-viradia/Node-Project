const couponService = require('../couponService');

const createCoupon = catchAsync(async(req, res) => {
    const result = await couponService.createCoupon(req.body);
    if(!result) {
        message = _localize("module.alreadyExists", req, "Coupon code");
        return utils.failureResponse(message, res);
    } else {
        res.message = _localize("module.create", req, "Coupon");
        return utils.successResponse(result, res);
    }
});

const updateCoupon = catchAsync(async(req, res) => {
    const result = await couponService.updateCoupon(req.params.id, req.body);
    if(!result) {
        message = _localize("module.alreadyExists", req, "Coupon code");
        return utils.failureResponse(message, res);
    } else {
        res.message = _localize("module.update", req, "Coupon");
        return utils.successResponse(result, res);
    }
});

const couponList = catchAsync(async(req, res) => {
    const result = await couponService.couponList(req);
    res.message = _localize("module.list", req, "Coupon");
    return utils.successResponse(result, res);
});

const partialUpdateCoupon = catchAsync(async(req, res) => {
    await couponService.partialUpdateCoupon(req.params.id, req.body);
    if(req.body?.isActive){
        res.message = _localize("module.activate", req, "Coupon");    
    }else{
        res.message = _localize("module.deactivate", req, "Coupon");    
    }
    return utils.successResponse({}, res);
});

const softDeleteCoupon = catchAsync( async (req, res) => {
    await couponService.softDeleteCoupon(req.body);
    res.message = _localize("module.delete", req, "Coupon")
    return utils.successResponse({}, res);
})

module.exports = {
    createCoupon,
    updateCoupon,
    couponList,
    partialUpdateCoupon,
    softDeleteCoupon
}