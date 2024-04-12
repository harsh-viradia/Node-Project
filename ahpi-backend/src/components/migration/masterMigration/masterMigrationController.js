const masterMigrateService = require("./masterMigrationService")

const updateMaster = catchAsync(async(req, res) => {
    await masterMigrateService.updateMaster()
    res.message = _localize("module.update", req, "master Migration")
    return utils.successResponse({}, res)
})

module.exports ={ 
    updateMaster
}