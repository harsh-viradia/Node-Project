const orderService = require("../order.service");
const Order = require('../order.model')

const createOrder = catchAsync(async (req, res) => {
    const result = await orderService.createService(req);
    res.message = _localize("module.create", req, "Order");
    return utils.successResponse(result, res);
});

const getOne = catchAsync(async (req, res) => {
    const orderNo = req.params.orderNo
    const result = await orderService.getOrder(orderNo)
    res.message = _localize("module.get", req, "Order");
    return utils.successResponse(result, res);
})

const listOrders = catchAsync(async (req, res) => {
    Object.assign(req.body.query, { "user.id": req.userId })
    const result = await orderService.listOrders(req);
    res.message = _localize("module.list", req, "Orders");
    return utils.successResponse(result, res);
});

module.exports = {
    createOrder: createOrder,
    getOne: getOne,
    listOrders
}
