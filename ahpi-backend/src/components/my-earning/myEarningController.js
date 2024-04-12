const myEarningService = require("./myEarningService")

const myEarningList = catchAsync(async (req, res) => {
    const result = await myEarningService.myEarningList(req.body, req.user );
    
    if(result.flag) {
        res.message = _localize("module.list", req, "Earning")
        return utils.successResponse(result.data, res)
    } else {
        message = result?.data
        return utils.failureResponse(message, res)
    }  
})

const earningAnalytics = catchAsync(async(req, res) => {
    const result = await myEarningService.earningAnalytics(req.body, req.user)
   
    if(result.flag) {
        res.message = _localize("module.get", req, "earning Analytics")
        return utils.successResponse(result, res)
    } else {
        message = result?.data
        return utils.failureResponse(message, res)
    }
})

const incomeList = catchAsync(async(req, res) => {
    const result = await myEarningService.incomeList(req.user)
    res.message = _localize("module.list", req, "my Income")
    return utils.successResponse(result, res)
})

module.exports = {
    myEarningList,
    earningAnalytics,
    incomeList,
}
