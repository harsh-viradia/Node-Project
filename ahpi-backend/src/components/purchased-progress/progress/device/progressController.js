const progresService = require("../progressServices");

const updateProgress = catchAsync( async (req, res) => {
    req.body.userId = req.user?._id
    const result = await progresService.updateProgress(req.body, req.headers.authorization);
    if(result.flag) {
        res.message = _localize("module.update", req, "progress");
        return utils.successResponse(result, res);
    }
    res.message = _localize("module.quizFailError", req, "progress");    
    return utils.successResponse(result.data, res);
})

module.exports = {
    updateProgress
}