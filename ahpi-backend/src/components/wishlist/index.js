const express = require('express')
const routes = express.Router()

const webRoutes = require('./web/wishlistRoutes')
const deviceRoutes = require('./device/wishlistRoutes')

routes.use('/web/api/v1/wishlist', webRoutes)
routes.use('/device/api/v1/wishlist', deviceRoutes)

module.exports = routes;