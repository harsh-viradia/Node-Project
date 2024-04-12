const analyticsServices = require('./analyticsServices');

// Course Analytics
const courseAnalyticsReport = catchAsync(async(req, res) => {
    req.body.timezone = req.header.timezone || process.env.TZ;
    const result = await analyticsServices.courseAnalyticsReport(req.body)
    res.message = _localize("module.get", req, 'report');
    return utils.successResponse(result, res);
});

const courseAnalyticsList = catchAsync(async(req, res) => {
    req.body.timezone = req.header.timezone || process.env.TZ;
    const result = await analyticsServices.courseAnalyticsList(req.body)
    res.message = _localize("module.list", req, 'courses');
    return utils.successResponse(result, res);
});

const courseAnalyticsExport = catchAsync(async(req, res) => {
    req.body.timezone = req.header.timezone || process.env.TZ;
    req.body.filter = {
        startDate: req.query?.startDate,
        endDate: req.query?.endDate,
        categories: req.query.categories?.split(',')
    },
    req.body.options = {
        "pagination": false
    },
    req.body.query = {
        search: req.query.search,
        searchColumns: req.query?.searchColumns?.split(','),
    }
    const result = await analyticsServices.courseAnalyticsExport(req.body);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=" + result.fileName);
    result.workbook.xlsx.write(res)
        .then(function () {
            res.end()
        });
});

// Category Analytics
const categoryAnalyticsReport = catchAsync(async(req, res) => {
    req.body.timezone = req.header.timezone || process.env.TZ;
    const result = await analyticsServices.categoryAnalyticsReport(req.body)
    res.message = _localize("module.get", req, 'report');
    return utils.successResponse(result, res);
});

const categoryAnalyticsList = catchAsync(async(req, res) => {
    req.body.timezone = req.header.timezone || process.env.TZ;
    const result = await analyticsServices.categoryAnalyticsList(req.body)
    res.message = _localize("module.list", req, 'categories');
    return utils.successResponse(result, res);
});

const categoryAnalyticsExport = catchAsync(async(req, res) => {
    req.body.timezone = req.header.timezone || process.env.TZ;
    req.body.filter = {
        startDate: req.query?.startDate,
        endDate: req.query?.endDate,
    },
    req.body.options = {
        "pagination": false
    },
    req.body.query = {
        search: req.query.search,
        searchColumns: req.query?.searchColumns?.split(','),
    }
    const result = await analyticsServices.categoryAnalyticsExport(req.body);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=" + result.fileName);
    result.workbook.xlsx.write(res)
        .then(function () {
            res.end()
        });
});

module.exports = {
    courseAnalyticsReport,
    courseAnalyticsList,
    courseAnalyticsExport,

    categoryAnalyticsReport,
    categoryAnalyticsList,
    categoryAnalyticsExport
}
