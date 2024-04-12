const express = require("express")
const router = express.Router()
const masterMigrateController = require("./masterMigrationController")

router.get("/update-master", masterMigrateController.updateMaster)

module.exports = router