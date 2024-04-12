const express = require("express");
const router = express.Router();
const analyticsController = require('./analyticsController');

// Course Analytics
router.post("/course-wise-report", authenticate, _checkPermission, analyticsController.courseAnalyticsReport).descriptor("admin.courseAnalytics.getReport");
router.post("/course-wise-list", authenticate, _checkPermission, analyticsController.courseAnalyticsList).descriptor("admin.courseAnalytics.getAll");
router.get("/export-course-report", analyticsController.courseAnalyticsExport).descriptor("admin.courseAnalytics.export");

// Category Analytics
router.post("/category-wise-report", authenticate, _checkPermission, analyticsController.categoryAnalyticsReport).descriptor("admin.categoryAnalytics.getReport");
router.post("/category-wise-list", authenticate, _checkPermission, analyticsController.categoryAnalyticsList).descriptor("admin.categoryAnalytics.getAll");
router.get("/export-category-report", analyticsController.categoryAnalyticsExport).descriptor("admin.categoryAnalytics.export");

//instructor analytics
// router.post("/course-slaes-wise-report", analyticsController.courseSalesAnalytcs)

module.exports = router;
