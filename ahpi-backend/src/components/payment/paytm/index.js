const routes = require("express").Router()
const webRoutes = require("./web/paytmRouter")
const deviceRoutes = require("./device/paytmRouter")

routes.use("/web/api/v1", webRoutes)
routes.use("/device/api/v1", deviceRoutes)

module.exports = routes