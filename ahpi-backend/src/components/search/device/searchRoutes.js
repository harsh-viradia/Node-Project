const express = require('express')
const routes = express.Router()
const searchController = require('./searchController')
const searchValidator = require('../searchValidations')

routes.post('/create', authenticate, _checkPermission, validate(searchValidator.create), searchController.createSearch);
routes.put('/update/:id', authenticate, _checkPermission, searchController.updateSearch);

routes.post('/guest/create', validate(searchValidator.create), searchController.updateSearch);
routes.put('/guest/update/:id', searchController.createSearch);

module.exports = routes;