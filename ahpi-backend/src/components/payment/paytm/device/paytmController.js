const { CHANNEL_ID } = require("../../../../configuration/constants/paymentConstant");
const paytmService = require("../paytmService")

const generateTransaction = catchAsync(async (req, res) => {
    const result = await paytmService.generateTransaction(req.body)
    if (result.flag == false) {
        if (!result?.paytmResp?.msg) message = _localize("module.alreadyExists", req, "order");
        message = result?.paytmResp?.msg
        utils.failureResponse(message, res);
    } else {
        utils.successResponse(result, res);
    }
})

const completeTransaction = catchAsync(async (req, res) => {
    if (req.originalUrl.search('device')) {
        req.body.channelId = CHANNEL_ID.WAP
    }
    await paytmService.completeTransaction(req, res)
})

module.exports = {
    generateTransaction,
    completeTransaction
}