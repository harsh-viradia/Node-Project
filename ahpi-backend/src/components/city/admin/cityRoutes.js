const express = require("express");
const routes = express.Router();
const cityController = require("./cityController");
const cityValidation = require("../validation");

routes.post("/create", authenticate, _checkPermission, validate(cityValidation.create), cityController.create).descriptor("admin.city.create");
routes.put("/update/:id", authenticate, _checkPermission, validate(cityValidation.update), cityController.update).descriptor("admin.city.update");
routes.put("/soft-delete", authenticate, _checkPermission, cityController.softDeleted).descriptor("admin.city.delete");
routes.patch("/partial-update/:id", authenticate, _checkPermission, cityController.updateActivityStatus).descriptor("admin.city.partialUpdate");
routes.post("/get-city-list", authenticate, _checkPermission, cityController.getList).descriptor("admin.city.getAll");
routes.patch("/update-default/:id", authenticate, _checkPermission, cityController.updateDefaultStatus).descriptor("admin.city.default");
routes.patch('/update/sequence/:id', authenticate, _checkPermission, validate(cityValidation.updateSequence), cityController.updateSequence).descriptor("admin.city.updateSequence");

module.exports = routes;