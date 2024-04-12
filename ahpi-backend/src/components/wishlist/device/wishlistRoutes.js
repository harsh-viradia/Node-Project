const express = require('express')
const routes = express.Router()
const wishlistController = require('./wishlistController')
const wishlistValidtion = require('../wishlistValidations')

routes.post('/save', authenticate, _checkPermission, validate(wishlistValidtion.save), wishlistController.saveCourse)
routes.post('/', authenticate, _checkPermission, wishlistController.list)
routes.post('/view-course', authenticate, _checkPermission, validate(wishlistValidtion.save), wishlistController.courseViewed)

module.exports = routes;