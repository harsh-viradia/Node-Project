const express = require('express');
const routes = express.Router();
const couponController = require('./couponController');
const validation = require('../couponValidation');

routes.put('/apply/guest', validate(validation.applyCoupon), couponController.applyCoupon);
routes.put('/apply', authenticate, _checkPermission, validate(validation.applyCoupon), couponController.applyCoupon);

module.exports = routes;