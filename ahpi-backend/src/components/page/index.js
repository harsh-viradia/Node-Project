const express = require("express");
const routes = express.Router();
const adminRoute = require('./admin/pageRoutes')
const webRoutes = require('./web/pageRoutes')
const deviceRoutes = require('./device/pageRoutes')

routes.use('/admin/pages', adminRoute)
routes.use('/web/api/v1/pages', webRoutes)
routes.use('/device/api/v1/pages', deviceRoutes)

module.exports = routes;
