const myLearningService = require("./../myLearning.service");

const listMyLearning = catchAsync(async (req, res) => {
    const result = await myLearningService.listMyLearning(req);
    res.message = _localize("module.list", req, "My Learning");
    return utils.successResponse(result, res);
});

const getCertificate = catchAsync(async (req, res) => {
    const result = await myLearningService.getCertificate(req.params?.certiCode);
    res.message = _localize("module.get", req, "Certificate");
    return utils.successResponse(result, res);
})

const updateCertificate = catchAsync(async(req, res) => {
    const result = await myLearningService.updateCertificate(req)
    res.message = _localize("module.update", req, "certificate")
    return utils.successResponse(result, res)
})

module.exports = {
    listMyLearning: listMyLearning,
    getCertificate,
    updateCertificate
}
