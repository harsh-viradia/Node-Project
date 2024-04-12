const express = require("express");
const routes = express.Router();

const allPermissionRoutes = require('./admin/permissionRoutes')

routes.use('/admin/permissions', allPermissionRoutes)

module.exports = routes;