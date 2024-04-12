const express = require("express");
const routes = express.Router();
const pageController = require('./pageController')
const {getCachingDataMiddleware} = require("../../../services/redis.service");

// open routes
routes.get('/guest/:slug', getCachingDataMiddleware, pageController.getPage)

// protected routes
routes.get('/:slug', authenticate, _checkPermission, getCachingDataMiddleware, pageController.getPage)

module.exports = routes;