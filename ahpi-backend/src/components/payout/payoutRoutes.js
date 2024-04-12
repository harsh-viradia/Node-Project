const express = require("express")
const router = express.Router()
const validation = require("./validation")

const payoutController = require("./payoutController")

router.post("/create", authenticate, _checkPermission, validate(validation.create), payoutController.add).descriptor("admin.payout.create")
router.post("/list", authenticate, _checkPermission, payoutController.list).descriptor("admin.payout.list")


module.exports = router