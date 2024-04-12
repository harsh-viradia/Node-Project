const express = require('express')
const routes = express.Router()
const courseController = require('./courseController')
const sectionController = require('./sectionController');
const { getCachingDataMiddleware } = require('../../../services/redis.service');

// open routes
routes.post('/guest', courseController.courseList);
routes.post('/filter/guest', courseController.courseFilterList);
routes.get('/guest/:slug', getCachingDataMiddleware , courseController.getCourseCashing);
routes.get('/sections/guest/:slug', getCachingDataMiddleware , sectionController.getSectionsByCourseCashing);

// protected routes
routes.post('/', authenticate, _checkPermission, courseController.courseList);
routes.post('/filter', authenticate, _checkPermission, courseController.courseFilterList);
routes.get('/:slug', authenticate, _checkPermission, courseController.getCourse);
routes.get('/sections/:slug', authenticate, _checkPermission, sectionController.getSectionsByCourse);
routes.put('/in-apps/transaction/:id',  courseController.updateInAppsTransactionIds);

module.exports = routes;