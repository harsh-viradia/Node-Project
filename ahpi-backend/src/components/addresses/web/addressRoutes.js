const express = require("express");
const routes = express.Router();
const addressController = require("./addressController");
const addressValidation = require("../addressValidation");

routes.post("/create", authenticate, _checkPermission, validate(addressValidation.createAndUpdate), addressController.addAddress);
routes.put("/update/:id", authenticate, _checkPermission, validate(addressValidation.createAndUpdate), addressController.updateAddress);
routes.put("/soft-delete", authenticate, _checkPermission, addressController.deleteAddress);
routes.patch("/partial-update/:id", authenticate, _checkPermission, addressController.partialUpdateAddress);
routes.post("/", authenticate, _checkPermission, addressController.addressList);
routes.get("/:id", authenticate, _checkPermission, addressController.getAddress);

module.exports = routes;