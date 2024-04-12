const { CHANNEL_ID, PAYTM_CODE } = require("../../../../configuration/constants/paymentConstant");
const paytmService = require("../paytmService")

const generateTransaction = catchAsync(async (req, res) => {
    const result = await paytmService.generateTransaction(req.body)
    if (result.flag == false) {
        let message
        if (!result?.paytmResp?.msg) message = _localize("module.alreadyExists", req, "order");
        if(result?.paytmResp?.code == PAYTM_CODE.SYSTEM_ERROR) message =  _localize("payment.system_error", req)  
        if(result?.paytmResp?.code != PAYTM_CODE.SYSTEM_ERROR && result?.paytmResp?.msg) {
            res.message = result?.paytmResp?.msg
            const data = {
                statusCode : result?.paytmResp?.code
            }
            return utils.badRequest(data, res);
        }
        return utils.failureResponse(message, res);
    } else {
        utils.successResponse(result, res);
    }
})

const completeTransaction = catchAsync(async (req, res) => {
    if (req.originalUrl.search('web')) {
        req.body.channelId = CHANNEL_ID.WEB
    }
    await paytmService.completeTransaction(req, res)
})

module.exports = {
    generateTransaction,
    completeTransaction
}