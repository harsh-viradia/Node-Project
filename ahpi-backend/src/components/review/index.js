const express = require("express");
const routes = express.Router();
const adminRoute = require('./admin/reviewsRoutes')
const webRoutes = require('./web/reviewRoutes')
const deviceRoutes = require('./device/reviewRoutes')

routes.use('/admin/reviews', adminRoute)
routes.use('/web/api/v1/reviews', webRoutes)
routes.use('/device/api/v1/reviews', deviceRoutes)

module.exports = routes;
