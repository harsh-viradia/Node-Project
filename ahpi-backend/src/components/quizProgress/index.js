const express = require("express");
const routes = express.Router();
const webRoutes = require('./web/quizRoutes')
const deviceRoutes = require('./device/quizRoutes')

routes.use('/web/api/v1/quiz', webRoutes)
routes.use('/device/api/v1/quiz', deviceRoutes)

module.exports = routes;