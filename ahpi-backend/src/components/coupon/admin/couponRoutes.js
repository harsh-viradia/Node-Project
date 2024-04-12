const express = require('express');
const routes = express.Router();
const validation = require('../couponValidation');
const couponController = require('./couponController');

routes.post('/create', authenticate, _checkPermission, validate(validation.createUpdateCoupon), couponController.createCoupon).descriptor('admin.coupons.create');
routes.put('/update/:id', authenticate, _checkPermission, validate(validation.createUpdateCoupon), couponController.updateCoupon).descriptor('admin.coupons.update');
routes.post('/', authenticate, _checkPermission, couponController.couponList).descriptor('admin.coupons.getAll');
routes.patch('/partial-update/:id', authenticate, _checkPermission, couponController.partialUpdateCoupon).descriptor('admin.coupons.partialUpdate');
routes.put('/soft-delete', authenticate, _checkPermission, couponController.softDeleteCoupon).descriptor('admin.coupons.delete');

module.exports = routes;