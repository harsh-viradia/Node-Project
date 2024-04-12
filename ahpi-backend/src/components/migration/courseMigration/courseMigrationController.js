const courseMigrationService = require("./courseMigrationService")

const addCertificateId = catchAsync(async (req, res) => {
    await courseMigrationService.addCertificateId();
    res.message = _localize("module.update", req, "publish Course")
    return utils.successResponse({}, res)
})

module.exports = {
    addCertificateId
}