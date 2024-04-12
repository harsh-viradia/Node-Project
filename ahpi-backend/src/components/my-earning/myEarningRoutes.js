const express = require("express")
const router = express.Router()

const myEarningCotroller = require("./myEarningController")

router.post("/list", authenticate, _checkPermission, myEarningCotroller.myEarningList).descriptor("admin.myEarning.list")
router.post("/analytics", authenticate, _checkPermission, myEarningCotroller.earningAnalytics).descriptor("admin.myEarning.analytics")
router.get("/incomes", authenticate, _checkPermission, myEarningCotroller.incomeList).descriptor("admin.myEarning.incomes")

module.exports = router