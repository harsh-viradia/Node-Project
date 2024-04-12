const express = require("express")
const routes = express.Router()
const adminRotes = require("./admin/seoRoutes")
const webRoutes = require("./web/seoRoutes")

routes.use("/admin/seo", adminRotes);
routes.use("/web/api/v1/seo", webRoutes);

module.exports = routes;