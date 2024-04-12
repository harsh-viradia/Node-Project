const express = require('express');
const routes = express.Router();
const settingController = require('./settingController')

routes.get('/:code', settingController.getPage);

module.exports = routes;
