const express = require("express");
const routes = express.Router();

const validator = require("../validation")
const notificationController = require("./notificationController")

routes.post("/create", authenticate, _checkPermission, validate(validator.create), notificationController.create).descriptor("admin.notification.create");
routes.put("/update/:id", authenticate, _checkPermission, validate(validator.create), notificationController.update).descriptor("admin.notification.update");
routes.put("/soft-delete", authenticate, _checkPermission, notificationController.softDelete).descriptor("admin.notification.delete");
routes.patch("/partial-update/:id", authenticate, _checkPermission, notificationController.partialUpdate).descriptor("admin.notification.partialUpdate")
routes.post("/list", authenticate, _checkPermission, notificationController.getList).descriptor("admin.notification.getAll");
routes.get("/send/:id", authenticate, _checkPermission, notificationController.sendNotification).descriptor("admin.notification.send");

module.exports = routes;