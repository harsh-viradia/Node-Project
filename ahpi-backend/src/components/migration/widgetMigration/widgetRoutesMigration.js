const express = require("express")
const router = express.Router()
const widgetMigrateController = require("./widgetMigrationController")

router.get("/add-title", widgetMigrateController.addTitleToWidget)

module.exports = router