const express = require("express");
const router = express.Router();
const categoryController = require('./categoryController');
const { getCachingDataMiddleware } = require("../../../services/redis.service");

// protected routes
router.post("/list", authenticate, _checkPermission, getCachingDataMiddleware ,categoryController.getList);

// open routes
router.post("/list/guest", getCachingDataMiddleware ,categoryController.getList);

module.exports = router;