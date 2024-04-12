const express = require("express");
const router = express.Router();

const allAdminRoutes =  require("./admin/countryRouters");
const allWebRoutes = require("./web/countryRouters")
const allDeviceRoutes = require("./device/countryRouters");

router.use("/admin/country", allAdminRoutes);
router.use("/web/api/v1/country", allWebRoutes);
router.use("/device/api/v1/country", allDeviceRoutes);

module.exports = router;