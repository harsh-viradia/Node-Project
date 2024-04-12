const express = require('express')
const orderAdminController = require("./order.instructor.controller");
const routes = express.Router()

routes.post('/list', authenticate, _checkPermission, orderAdminController.listOrders).descriptor("admin.orders.getAll");
routes.get('/export-list', orderAdminController.exportOrders).descriptor("admin.orders.export");
routes.post('/send-invoice/:orderId', authenticate, _checkPermission, orderAdminController.sendInvoice);
routes.get('/get/:id', authenticate, _checkPermission, orderAdminController.getOne).descriptor("admin.orders.get");

module.exports = routes;
