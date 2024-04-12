const express = require("express");
const pageValidate = require('../page.validation')
const routes = express.Router();
const pageController = require('./pageController')

routes.put('/:id', authenticate, _checkPermission, validate(pageValidate.createPage), pageController.updatePage).descriptor("admin.page.update");
routes.post('/', authenticate, _checkPermission, pageController.getPageList).descriptor("admin.page.getAll");

module.exports = routes;
