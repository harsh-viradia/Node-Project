const express = require("express");
const router = express.Router();

const allAdminRoutes =  require("./admin/cityRoutes");
const allWebRoutes = require("./web/cityRoutes")
const allDeviceRoutes = require("./device/cityRoutes");

router.use("/admin/city", allAdminRoutes);
router.use("/web/api/v1/city", allWebRoutes);
router.use("/device/api/v1/city", allDeviceRoutes);

module.exports = router;