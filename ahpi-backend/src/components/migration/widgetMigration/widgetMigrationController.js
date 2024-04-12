const widgetMigrateService = require("./widgetMigrationService")

const addTitleToWidget = catchAsync(async(req, res) => {
    await widgetMigrateService.addTitleToWidget()
    res.message = _localize("module.update", req, "widget Migration")
    return utils.successResponse({}, res)
})

module.exports ={ 
    addTitleToWidget
}
