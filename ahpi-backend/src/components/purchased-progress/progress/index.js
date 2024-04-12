const express = require("express");
const routes = express.Router();

const webRoutes = require("./web/progressRoutes")
const deviceRoutes = require("./device/progressRoutes")

routes.use("/web/api/v1/progress", webRoutes);
routes.use("/device/api/v1/progress", deviceRoutes);

module.exports = routes;