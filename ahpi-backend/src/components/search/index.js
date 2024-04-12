const express = require('express')
const routes = express.Router()

const webRoutes = require('./web/searchRoutes')
const deviceRoutes = require('./device/searchRoutes')

routes.use('/web/api/v1/search', webRoutes)
routes.use('/device/api/v1/search', deviceRoutes)

module.exports = routes;