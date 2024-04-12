const express = require("express");
const router = express.Router();
const cartValidation = require("../validation");
const cartController = require('./cart.web.controller')

// protected routes
router.put('/add', authenticate, _checkPermission, validate(cartValidation.updateCart), cartController.updateCart);
router.put('/remove', authenticate, _checkPermission, validate(cartValidation.removeItemFromCart), cartController.removeFromCart);
router.get('/', authenticate, _checkPermission, cartController.getCart);
router.get('/count', authenticate, _checkPermission, cartController.cartCount);

// open routes
router.put('/add/guest', validate(cartValidation.updateCart), cartController.updateCart);
router.put('/remove/guest', validate(cartValidation.removeItemFromCart), cartController.removeFromCart);
router.get('/guest', cartController.getCart);
router.get('/count/guest', cartController.cartCount);

module.exports = router;
