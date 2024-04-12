const express = require("express");
const certificateRoutes = require("./certificateRoutes");
const route = express.Router();

route.use("/admin/certificate", certificateRoutes);
route.use("/instructor/certificate", certificateRoutes);

module.exports = route;
