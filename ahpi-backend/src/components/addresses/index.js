const express=require("express")
const route=express.Router()
const webRoutes = require("./web/addressRoutes")
const DeviceRoutes = require("./device/addressRoutes")
const AdminRoutes = require('./admin/addressRoutes');

route.use("/web/api/v1/address", webRoutes);
route.use("/device/api/v1/address", DeviceRoutes);
route.use("/admin/api/v1/address", AdminRoutes);

module.exports = route;