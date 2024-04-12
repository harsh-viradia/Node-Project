const express = require("express")
const router = express.Router()
const publishCoursesController = require("./courseMigrationController")

router.get("/add-certificateId", publishCoursesController.addCertificateId)

module.exports = router