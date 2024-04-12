const express = require("express");
const routes = express.Router();
const addressController = require("./addressController");

routes.post("/", authenticate, _checkPermission, addressController.addressList).descriptor("admin.address.getAll");

module.exports = routes;