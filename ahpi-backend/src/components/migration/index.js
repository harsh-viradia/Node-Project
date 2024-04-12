const express = require("express")
const router = express.Router()

router.use("/order", require("./orderMigration/orderRoutesMigration"))
router.use("/course", require("./courseMigration/courseMigrationRoute"))
router.use("/widget", require("./widgetMigration/widgetRoutesMigration"))
router.use("/master", require("./masterMigration/masterRoutesMigration"))

module.exports = router