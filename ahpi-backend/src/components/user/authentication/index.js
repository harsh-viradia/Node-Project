const router = require("express").Router()

router.use("/auth", require("./authenticationRoutes"))

module.exports = router