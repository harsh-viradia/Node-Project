const express = require("express");
const router = express.Router();

const allAdminRoutes =  require("./analyticsRoutes");
const allInstructorRoutes = require("./instructor/instructoAnalyticsRoutes")

router.use("/admin/analytics", allAdminRoutes);
router.use("/instructor/analytics", allInstructorRoutes)
module.exports = router;