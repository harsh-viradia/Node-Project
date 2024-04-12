const express = require("express")
const router = express.Router()
const orderMigrateController = require("./orderMigrationController")

router.get("/add-primary-cate", orderMigrateController.addPrimaryCateToOrder)

module.exports = router