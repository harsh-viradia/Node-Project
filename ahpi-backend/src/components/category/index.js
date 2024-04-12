const express = require("express");
const routes = express.Router();

const allCatgoryRoutes = require("./admin/categoryRoutes");
const deviceCategoryRoutes = require("./device/categoryRoutes");
const learnerCategory = require("./web/categoryRoutes");

routes.use("/admin/category", allCatgoryRoutes);
routes.use("/device/api/v1/category", deviceCategoryRoutes);
routes.use("/web/api/v1/category", learnerCategory);

module.exports = routes;
