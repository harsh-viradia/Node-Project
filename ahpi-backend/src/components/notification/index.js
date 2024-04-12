const express = require("express");
const route = express.Router();

const allWebRoutes = require("./web/notificationRoues");
const deviceRoutes = require("./device/notificationRoues");
const allAdminRoutes = require("./admin/notificationRoues");

route.use("/web/api/v1/notification", allWebRoutes);
route.use("/device/api/v1/notification", deviceRoutes);
route.use("/admin/notification", allAdminRoutes);

module.exports = route;