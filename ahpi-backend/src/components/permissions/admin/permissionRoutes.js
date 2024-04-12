const express = require("express");
const routes = express.Router();
const permissionController = require("./permissionController");
const permissionValidation = require("../permissionValidator");

routes.get("/get/:id", authenticate, _checkPermission, permissionController.getPermission).descriptor("admin.permission.getPermission");
routes.put("/update/:id", authenticate, _checkPermission, validate(permissionValidation.update), permissionController.updatePermission).descriptor("admin.permission.updatePermission");
routes.get("/get-permission", authenticate, _checkPermission, permissionController.getPermissionByUser).descriptor("admin.permission.getPermissionUser");

module.exports = routes;
