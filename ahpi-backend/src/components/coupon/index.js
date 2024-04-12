const express = require("express")
const routes = express.Router();
const adminRoutes = require('./admin/couponRoutes');
const webRoutes = require('./web/couponRoutes');
const deviceRoutes = require('./device/couponRoutes');

routes.use("/admin/coupon", adminRoutes);
routes.use("/web/api/v1/coupon", webRoutes);
routes.use("/device/api/v1/coupon", deviceRoutes);

module.exports = routes;