const payoutService = require("./payoutService")
const { PAYOUT_TYPE, PAYOUT_STATUS_TYPE } = require("../../configuration/constants/payoutConstant")

const add = catchAsync(async (req, res) => {
    let data = {
        ...req.body
    }
    data.year = parseInt(data?.month?.split(" ")[1])
    data.month = parseInt(data?.month?.split(" ")[0])
    data.payoutType = PAYOUT_TYPE.MANUAL_TRANSFER
    data.status=PAYOUT_STATUS_TYPE.COMPLETED
    const result = await payoutService.add(data)
    if(result.flag) {
        res.message = _localize("module.add", req, "payout")
        return utils.successResponse(result, res)
    } else {
        message = _localize(result.data, req, "Payment")
        return utils.failureResponse(message, res)
    }
})

const list = catchAsync(async (req, res) => {
    const result = await payoutService.list(req.body)
    if(result.flag){
        res.message = _localize("module.list", req, "payout")
        return utils.successResponse(result.data, res)
    } 
    message = result?.data
    return utils.failureResponse(message, res);
})

module.exports = {
    add,
    list
}