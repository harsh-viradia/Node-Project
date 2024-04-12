const express = require('express')
const paymentDeviceRoute = require("./device/paymentRoutes");
const paymentWebRoute = require("./web/paymentRoutes");
const adminRoutes = require('./admin/paymentRoutes')
const paytmRoutes = require("./paytm/index")
const routes = express.Router()

routes.use("/admin/api/v1/payment", adminRoutes);
routes.use("/device/api/v1/payment", paymentDeviceRoute);
routes.use("/web/api/v1/payment", paymentWebRoute);

//paytm routes
routes.use("/paytm", paytmRoutes)

module.exports = routes;
