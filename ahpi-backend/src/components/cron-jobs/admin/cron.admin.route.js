const express = require('express')
const cronAdminController = require("./cron.admin.controller");
const routes = express.Router()

routes.get('/badge', authenticate, _checkPermission, cronAdminController.badgeCron);
routes.get('/update-review', authenticate, _checkPermission, cronAdminController.updateReviewsInCourses);

module.exports = routes;
