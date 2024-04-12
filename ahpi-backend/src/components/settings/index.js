const express = require('express')
const routes = express.Router()
const webRoutes = require('./web/settingRoutes')
const deviceRoutes = require('./device/settingRoutes')

routes.use("/web/api/v1/settings", webRoutes);
routes.use("/device/api/v1/settings", deviceRoutes);

module.exports = routes;
