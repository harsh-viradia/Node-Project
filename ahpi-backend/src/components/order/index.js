const express = require('express')
const orderDeviceRoute = require("./device/order.device.route");
const orderWebRoute = require("./web/order.web.route");
const orderAdminRoute = require("./admin/order.admin.route");
const orderInstructorRoute = require("./instructor/order.instructor.route");

const routes = express.Router()

routes.use("/device/api/v1/order", orderDeviceRoute);
routes.use("/web/api/v1/order", orderWebRoute);
routes.use("/admin/api/v1/order", orderAdminRoute);
routes.use("/instructor/api/v1/order", orderInstructorRoute);


module.exports = routes;
