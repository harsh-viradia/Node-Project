const express = require('express')
const routes = express.Router()
const {myServerAdapter, queueMiddleware} = require('./createJobs')

routes.use("/queue", queueMiddleware, myServerAdapter.getRouter())

module.exports = routes;
