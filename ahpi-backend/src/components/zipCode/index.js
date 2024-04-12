const express = require("express");
const routes = express.Router();
const allAdminRoutes = require("./admin/zipRoutes");
const allWebRoutes = require("./web/zipRoutes");
const allDeviceRoutes = require("./device/zipRoutes");

routes.use("/admin/zip-code", allAdminRoutes);
routes.use("/web/v1/api/zipcode", allWebRoutes);
routes.use("/device/v1/api/zipcode", allDeviceRoutes);

module.exports = routes;
