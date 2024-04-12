const services = require("../notificationService");
const notificationModel = require("../notificationModel");

const create = catchAsync( async (req, res) => {
    const result = await services.create(req.body);
    if (!req.body?.sendNotification) {
        res.message = _localize("module.create", req, "Notification");
        return utils.successResponse(result,res);
    }
    res.message = _localize("validations.sentNotification", req,  {"{module}": `Notification created`, "{anotherEvent}": "sent"});
    return utils.successResponse(result, res);
})

const update = catchAsync( async (req, res) => {
    const result = await services.update(req.params.id, req.body);
    if (!req.body?.sendNotification) {
        res.message = _localize("module.update", req, "Notification");
        return utils.successResponse(result, res);
    } else if (req.body?.sendNotification && result?.isActive) {
        res.message = _localize("validations.sentNotification", req,  {"{module}": `Notification updated`, "{anotherEvent}": "sent"});
        return utils.successResponse(result, res);
    } else {
        message = _localize("validations.sentNotificationErr", req,  {"{module}": `Notification updated`, "{reason}": "it is not active."});
        return utils.failureResponse(message, res);
    }
})

const partialUpdate = catchAsync( async (req, res) => {
    await services.partialUpdate(req.params.id, req.body);
    if(req.body?.isActive){
        res.message = _localize("module.activate", req, "Notification");    
    }else{
        res.message = _localize("module.deactivate", req, "Notification");    
    }
    return utils.successResponse({}, res);
});

const sendNotification = catchAsync( async (req, res) => {
    const result = await services.sendNotification(req.params.id);
    if(result) {
        res.message = _localize("module.sentData", req, "Notification");
        return utils.successResponse({}, res);
    }
    message = _localize("validations.cannotSent", req,  {"{module}": `notification`, "{reason}": "it is not active."});
    return utils.failureResponse(message, res);
});

const getList = catchAsync( async (req, res) => {
    const result = await services.getList(req, notificationModel)
    res.message = _localize("module.list", req, "Notification");
    return utils.successResponse(result, res);
})

const softDelete = catchAsync( async (req, res) => {
    await services.softDelete(req.body.ids);
    res.message = _localize("module.delete", req, "Notification")
    return utils.successResponse({}, res);
})

module.exports = {
    create,
    update,
    partialUpdate,
    getList,
    sendNotification,
    softDelete
}