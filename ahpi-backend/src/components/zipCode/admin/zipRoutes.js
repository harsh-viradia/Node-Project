const express = require("express");
const routes = express.Router()
const zipController = require("./zipController")
const validator = require("../validation")

routes.post("/create", authenticate, _checkPermission, validate(validator.create), zipController.create).descriptor("admin.zipCode.create");
routes.put("/update/:id", authenticate, _checkPermission, validate(validator.create), zipController.update).descriptor("admin.zipCode.update");
routes.patch("/partial-update/:id", authenticate, _checkPermission, zipController.partialUpdate).descriptor("admin.zipCode.partialUpdate");
routes.put("/soft-delete", authenticate, _checkPermission, zipController.softDelete).descriptor("admin.zipCode.delete");
routes.post("/all", zipController.getSearchedData).descriptor("admin.zipCode.getAll");
routes.get("/:id", zipController.getsingleDoc).descriptor("admin.zipCode.get");

module.exports = routes;