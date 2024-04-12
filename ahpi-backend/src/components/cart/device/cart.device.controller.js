const cartServices = require("../cart.service");

const updateCart = catchAsync(async (req, res) => {
    req.body.deviceToken = req.query?.deviceToken;
    req.body.userId = req.user?._id;
    const result = await cartServices.updateCart(req.body);
    res.message = _localize("module.save", req, 'cart');
    return utils.successResponse(result, res);
});

const removeFromCart = catchAsync(async (req, res) => {
    req.body.deviceToken = req.query?.deviceToken;
    req.body.userId = req.user?._id;
    const result = await cartServices.removeItemFromCart(req.body);
    res.message = _localize("module.remove", req, 'cart');
    return utils.successResponse(result, res);
});


const getCart = catchAsync(async(req, res)=>{
    const deviceToken = req.query?.deviceToken;
    const userId = req.userId;
    const result = await cartServices.getCart({deviceToken, userId});
    res.message = _localize("module.get", req, 'cart');
    return utils.successResponse(result, res);
})

const cartCount = catchAsync(async( req, res) => {
    const deviceToken = req.query?.deviceToken;
    const userId = req.userId;
    const result = await cartServices.cartCount({deviceToken, userId});
    res.message = _localize("module.get", req, 'cart');
    return utils.successResponse(result, res);
})

module.exports = {
    updateCart: updateCart,
    removeFromCart: removeFromCart,
    getCart: getCart,
    cartCount
}