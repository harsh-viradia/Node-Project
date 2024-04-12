const express = require("express")
const router = express.Router()

router.use("/instructor/my-earning", require("./myEarningRoutes"))

module.exports = router