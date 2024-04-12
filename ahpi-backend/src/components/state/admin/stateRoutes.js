const express = require("express");
const routes = express.Router();
const stateController = require("./stateController");
const stateValidation = require("../validation");

routes.post("/create",  authenticate, _checkPermission, validate(stateValidation.create), stateController.create).descriptor("admin.state.create");
routes.put("/update/:id",  authenticate, _checkPermission, validate(stateValidation.update), stateController.update).descriptor("admin.state.update");
routes.put("/soft-delete",  authenticate, _checkPermission, stateController.softDeleted).descriptor("admin.state.delete");
routes.patch("/update-default/:id",  authenticate, _checkPermission, stateController.updateDefaultStatus).descriptor("admin.state.default");
routes.post("/get-state-list",  authenticate, _checkPermission, stateController.getList).descriptor("admin.state.getAll");
routes.patch("/partial-update/:id",  authenticate, _checkPermission, stateController.updateActivityStatus).descriptor("admin.state.partialUpdate");
routes.patch('/update/sequence/:id',  authenticate, _checkPermission, validate(stateValidation.updateSequence), stateController.updateSequence).descriptor("admin.state.updateSequence");

module.exports = routes;