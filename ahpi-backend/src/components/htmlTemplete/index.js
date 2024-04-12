const express = require('express');
const htmlTemplateRoute = require("./admin/htmlTemplate.admin.route");
const routes = express.Router()

routes.use("/admin/api/v1/html-templates", htmlTemplateRoute);

module.exports = routes;
