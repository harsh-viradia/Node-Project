const express = require('express');
const routes = express.Router();
const orderDeviceController = require('./order.device.controller');
const orderValidations = require('../orderValidations');

routes.post('/create', authenticate, _checkPermission, validate(orderValidations.create), orderDeviceController.createOrder);
routes.post('/', authenticate, _checkPermission, orderDeviceController.listOrders);
routes.get('/get/:orderNo', authenticate, _checkPermission, orderDeviceController.getOne);

module.exports = routes;
