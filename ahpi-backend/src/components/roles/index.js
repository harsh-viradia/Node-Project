const express = require("express");
const routes = express.Router();

const allRoleRoutes = require('./admin/roleRoutes')

routes.use('/admin/role', allRoleRoutes)

module.exports = routes;