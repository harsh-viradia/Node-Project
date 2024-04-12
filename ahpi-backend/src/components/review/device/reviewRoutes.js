const express = require("express");
const routes = express.Router();
const reviewController = require('./reviewController')
const reviewValidate = require("../review.validation")


// protected routes
routes.post('/create', authenticate, _checkPermission, validate(reviewValidate.createReview), reviewController.create);
routes.post('/', authenticate, _checkPermission, reviewController.getReviewList);

// open routes
routes.post('/guest', reviewController.getReviewList);

module.exports = routes;
