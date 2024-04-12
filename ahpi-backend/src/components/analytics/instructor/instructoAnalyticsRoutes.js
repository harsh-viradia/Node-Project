const express = require("express");
const router = express.Router();
const instructorAnalyticsContorller = require("./instructoAnalyticsController")

//instructor analytics
router.post("/course-slaes-wise-report", authenticate, _checkPermission, instructorAnalyticsContorller.courseSalesAnalytcs).descriptor("admin.instructorAnalytics.courseAnalytics")
router.post("/course-rating-wise-analytics", authenticate, _checkPermission, instructorAnalyticsContorller.courseRatingAnalytics).descriptor("admin.instructorAnalytics.ratingAnalytics")
module.exports = router;