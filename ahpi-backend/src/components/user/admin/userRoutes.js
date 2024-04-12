const express = require("express");
const routes = express.Router();
const userController = require("./userController");
const uservalidation = require("../validations/uservalidation");

routes.post("/create", authenticate, _checkPermission, validate(uservalidation.createOrUpdateSchema), userController.add).descriptor("admin.users.create");
routes.put("/update/:id", authenticate, _checkPermission, validate(uservalidation.createOrUpdateSchema), userController.update).descriptor("admin.users.update");
routes.put("/soft-delete", authenticate, _checkPermission, userController.softDeleteUser).descriptor("admin.users.delete");
routes.post("/", authenticate, _checkPermission, userController.getList).descriptor("admin.users.getAll");
routes.patch("/partial-update/:id", authenticate, _checkPermission, userController.partialUpdate).descriptor("admin.users.partialUpdate");

module.exports = routes;