const express = require('express');
const routes = express.Router();
const orderWebController = require('./order.web.controller');
const orderValidations = require('../orderValidations');

routes.post('/create', authenticate, _checkPermission, validate(orderValidations.create),orderWebController.createOrder);
routes.post('/', authenticate, _checkPermission, orderWebController.listOrders);
routes.get('/get/:orderNo', authenticate, _checkPermission, orderWebController.getOne);

module.exports = routes;
