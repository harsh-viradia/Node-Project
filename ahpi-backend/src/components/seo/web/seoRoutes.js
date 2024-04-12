const express = require("express");
const routes = express.Router();

const seoController = require("./seoController");
const { getCachingDataMiddleware } = require("../../../services/redis.service");

// open routes
routes.get("/get/guest/:type/:slug", getCachingDataMiddleware ,seoController.getSEO);

// protected routes
routes.get("/get/:type/:slug", authenticate, _checkPermission, getCachingDataMiddleware ,seoController.getSEO);

module.exports = routes;