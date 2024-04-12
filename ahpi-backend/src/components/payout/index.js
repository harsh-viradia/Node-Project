const express = require("express")
const router = express.Router()

router.use("/admin/payout", require("./payoutRoutes"))

module.exports = router