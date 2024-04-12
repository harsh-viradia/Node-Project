const services = require("../notificationService");
const NotificationsList = require('../notificationListModel');

const generalNotificationList = catchAsync( async (req, res) => {
    const result = await services.getList(req, NotificationsList)
    res.message = _localize("module.list", req, "Notification");
    return utils.successResponse(result, res);
})

const floatingNotificationList = catchAsync( async (req, res) => {
    let user = req?.user || {};
    let timezone = req?.header?.timezone || process.env.TZ;
    const result = await services.floatingNotificationList(user, timezone)
    res.message = _localize("module.list", req, "Floating notifications");
    return utils.successResponse(result, res);
});

const updateReadStatus = catchAsync(async (req, res) => {
    await services.updateReadStatus(req.params.id, req.body);
    res.message = _localize("specificMsg.notificationRead", req);
    return utils.successResponse({}, res)
});

const notificationCount = catchAsync(async (req, res) => {
    const result = await services.notificationCount(req.user);
    res.message = _localize("module.get", req, "Notification count");
    return utils.successResponse(result, res)
});

module.exports = {
    generalNotificationList,
    floatingNotificationList,
    updateReadStatus,
    notificationCount
}