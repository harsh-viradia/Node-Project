const express = require("express");
const routes = express.Router();

const myLearningWebRoutes = require("./web/myLearning.web.route")
const myLearningDeviceRoutes = require("./device/myLearning.device.route")

routes.use("/web/api/v1/my-learning", myLearningWebRoutes);
routes.use("/device/api/v1/my-learning", myLearningDeviceRoutes);

module.exports = routes;