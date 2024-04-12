const express = require("express");
const reviewValidate = require('../review.validation')
const routes = express.Router();
const reviewController = require('./reviewController')


routes.post('/list', authenticate, _checkPermission, reviewController.getReviewList).descriptor("admin.reviews.getAll")
routes.patch("/partial-update/:id", authenticate, _checkPermission, reviewController.updateActivityStatus).descriptor("admin.reviews.partialUpdate");

module.exports = routes;
