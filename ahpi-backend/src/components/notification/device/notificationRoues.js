const express = require("express");
const routes = express.Router();

const notificationController = require("./notificationController")

routes.post("/general/list", authenticate, _checkPermission, notificationController.generalNotificationList);
routes.patch('/partial-update/:id', authenticate, _checkPermission, notificationController.updateReadStatus);
routes.get("/floating/list", authenticate, _checkPermission, notificationController.floatingNotificationList);
routes.get("/floating/list/guest", notificationController.floatingNotificationList);
routes.get("/general/count", authenticate, _checkPermission, notificationController.notificationCount);

module.exports = routes;