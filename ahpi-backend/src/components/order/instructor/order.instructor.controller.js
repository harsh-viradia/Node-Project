const orderService = require("../order.service");
const Order = require('../order.model')

const listOrders = catchAsync(async (req, res) => {
    const result = await orderService.listOrders(req);
    res.message = _localize("module.list", req, "Orders");
    return utils.successResponse(result, res);
});

const exportOrders = catchAsync(async (req, res) => {
    const {workbook, fileName} = await orderService.exportOrders(req);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    workbook.xlsx.write(res)
        .then(function () {
            res.end()
        });
});

const sendInvoice = catchAsync(async (req, res) => {
    const result = await orderService.sendInvoice(req.params.orderId);
    res.message = _localize("module.sentData", req,"invoice");
    return utils.successResponse(result, res);
});

const getOne = catchAsync(async (req, res) => {
    const id = req.params.id
    const result = await Order.findOne({ _id: id }).populate('userId', 'email name').populate('receiptId', 'uri')
    res.message = _localize("module.get", req,"Order");
    return utils.successResponse(result, res);
})

module.exports = {
    listOrders: listOrders,
    exportOrders: exportOrders,
    sendInvoice: sendInvoice,
    getOne:getOne
}
