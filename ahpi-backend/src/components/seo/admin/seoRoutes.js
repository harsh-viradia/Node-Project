const express = require("express");
const routes = express.Router();

const seoController = require("./seoController");
const validator = require("../validation");

routes.post("/", authenticate, _checkPermission, validate(validator.createSeo), seoController.createSEO).descriptor("admin.seo.create");
routes.put("/update/:id", authenticate, _checkPermission, validate(validator.updateSeo), seoController.updateSEO).descriptor("admin.seo.update");
routes.get("/get/:type/:slug", authenticate, _checkPermission, seoController.getSEO).descriptor("admin.seo.get");

module.exports = routes;