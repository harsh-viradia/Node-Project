const orderMigrateService = require("./orderMigrationService")

const addPrimaryCateToOrder = catchAsync(async(req, res) => {
    await orderMigrateService.addPrimaryCateToOrder()
    res.message = _localize("module.update", req, "order Migration")
    return utils.successResponse({}, res)
})

module.exports ={ 
    addPrimaryCateToOrder
}