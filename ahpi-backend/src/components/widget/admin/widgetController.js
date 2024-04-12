const widgetService = require('../widgetServices');
const {setExpireTime} = require("../../../services/redis.service");
const { CASHING_KEY_NAME } = require('../../../configuration/constants/cacheConstants');

const addWidget = catchAsync(async (req, res) => {
  const result = await widgetService.create(req.body);
  if(result.flag) {
    // for delete cache of redis server for add in widget
    await setExpireTime(req.headers[CASHING_KEY_NAME],0)
    res.message = _localize("module.create", req, "widget");
    return utils.successResponse(result.data, res);
  } else {
    message = _localize("module.alreadyExists", req, "widget code");
    return utils.failureResponse(message, res);
  }
});

const updateWidget = catchAsync(async (req, res) => {
  const result = await widgetService.update(req.params.id, req.body);
  if (result.flag) {
    // for delete cache of redis server
    await setExpireTime(req.headers[CASHING_KEY_NAME],0)
    res.message = _localize("module.update", req, "widget");
    return utils.successResponse(result.data, res);
  }
    message = _localize("module.alreadyExists", req, "widget code");
    return utils.failureResponse(message, res);
  
});

const deleteWidget = catchAsync(async (req, res) => {
  await widgetService.softDelete(req.body);
  
  // for delete cache of redis server for update in widget
  await setExpireTime(req.headers[CASHING_KEY_NAME],0)

  res.message = _localize("module.delete", req, "widget");
  return utils.successResponse({}, res);
});

const partialUpdate = catchAsync(async (req, res) => {
  await widgetService.partialUpdate(req.body, req.params.id);
  if (req.body?.isActive) {
    res.message = _localize("module.activate", req, "widget");
  } else {
    res.message = _localize("module.deactivate", req, "widget");
  }
  return utils.successResponse({}, res);
});

const listWidget = catchAsync(async (req, res) => {
  const result = await widgetService.getList(req.body)
  res.message = _localize("module.list", req, "widgets");
  return utils.successResponse(result, res);
});

const getWidgetById = catchAsync(async (req, res) => {
  const result = await widgetService.getWidget(req.params.id)
  res.message = _localize("module.get", req, "widget");
  return utils.successResponse(result, res);
});
module.exports = {
  addWidget,
  updateWidget,
  deleteWidget,
  partialUpdate,
  listWidget,
  getWidgetById,
};
