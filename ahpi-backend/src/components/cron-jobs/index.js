const express = require('express')
const routes = express.Router();
const cronAdminRoute = require('./admin/cron.admin.route')

routes.use("/admin/api/v1/cron", cronAdminRoute);

module.exports = routes;
