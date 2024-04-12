const Order = require('../../order/order.model')
const Transactions = require('../../payment/paymentModel')
const midTransPaymentService = require("../paymentService")
const dbService = require('../../../services/db.service')



const getTransactionUrl = catchAsync(async (req, res) => {
    const data = req.body;
    const result = await midTransPaymentService.transactionRedirectUrl(data, req)
    if (result.flag == false) {
        message = _localize("module.alreadyExists", req, "order");
        utils.failureResponse(message, res);
    }  else {
        utils.successResponse(result, res);
    }
})


const getTransactionStatus = catchAsync(async (req, res) => {
    let midOrderId = req.query?.id ? req.query?.id : req.query?.order_id ? req.query?.order_id : JSON.parse(req.body?.response)?.order_id
    await midTransPaymentService.getTransactionStatus(res, midOrderId)
})


const getStatus = catchAsync(async (req, res) => {
    const id = req.params.id
    let result = await Order.findOne({ orderNo: id })
    res.message = _localize("order.getStatus", req);
    utils.successResponse(result, res);
})

const getInvoice = catchAsync(async (req, res) => {
    const orderNo = req.body.orderNo;
    const invoiceFile = await Order.findOne({
        orderNo: orderNo,
    }).populate({ path: "receiptId", select: "uri" }).select('receiptId')
    utils.successResponse(invoiceFile, res);
});

const getTransactionsList = catchAsync(async(req,res)=>{
    let options = {};
    let query = {};
    const data = req.body
    if (data?.options) {
        options = {
            ...data.options,
        };
    }
    if (data?.query) {
        query = {
            ...data.query,
        };
    }
    const result = await dbService.getAllDocuments(Transactions, query, options)
    res.message = _localize("module.list", req, "Transactions")
    utils.successResponse(result, res);

})

module.exports = {
    getTransactionUrl,
    getTransactionStatus,
    getStatus,
    getInvoice,
    getTransactionsList
}