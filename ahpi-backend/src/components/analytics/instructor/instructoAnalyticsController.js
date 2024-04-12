const analyticsServices = require('../analyticsServices');

const courseSalesAnalytcs = catchAsync(async (req, res) => {
    req.body.user = req?.user
    const result = await analyticsServices.courseSalesAnalytcs(req.body)
    res.message = _localize("module.get", req, "instructor Analytic Report")
    return utils.successResponse(result, res)
})

const courseRatingAnalytics = catchAsync(async (req, res) => {
    req.body.user = req?.user
    const result = await analyticsServices.courseRatingAnalytics(req.body)
    res.message = _localize("module.get", req, "instructor Analytic Report")
    return utils.successResponse(result, res)
})

module.exports = {
    courseSalesAnalytcs,
    courseRatingAnalytics
}
