const express = require("express");
const router = express.Router();

const allAdminRoutes = require("./admin/widgetRoutes");

router.use("/admin/widget", allAdminRoutes);

module.exports = router;
