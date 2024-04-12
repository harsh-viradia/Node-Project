const express = require("express");
const routes = express.Router();

const fileRouter = require('./fileRoute')

routes.use('/file', fileRouter)

module.exports = routes;