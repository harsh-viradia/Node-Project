const express = require("express");
const router = express.Router();

const allAdminRoutes = require("./admin/stateRoutes");
const allwebRoutes = require("./web/stateRoutes");
const allDeviceRoutes = require("./device/stateRoutes");

router.use("/admin/state", allAdminRoutes);
router.use("/web/api/v1/state", allwebRoutes);
router.use("/device/api/v1/state", allDeviceRoutes);

module.exports = router;