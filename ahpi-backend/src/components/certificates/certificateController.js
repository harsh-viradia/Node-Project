const certificateService = require("./certificateService");

const partialUpdate = catchAsync(async (req, res) => {
  const result = await certificateService.partialUpdate(
    req.body,
    req.params.id
  );
  if (result.flag && req.body?.isActive) {
    res.message = _localize("module.activate", req, "certificate");
  } else {
    res.message = _localize("module.deactivate", req, "certificate");
  }
  return utils.successResponse({}, res);
});

const setDefaultTemplate = catchAsync(async (req, res) => {
  const result = await certificateService.setDefaultTemplate(
    req.body,
    req.params.id
  );
  if (req.body?.isDefault) {
    res.message = _localize("module.defaultStatusActivate", req, "certificate");
  } else {
    res.message = _localize(
      "module.defaultStatusDeactivate",
      req,
      "certificate"
    );
  }
  return utils.successResponse({}, res);
});

const list = catchAsync(async (req, res) => {
    const result = await certificateService.getList(req.body);
    res.message = _localize("module.get", req, "certificate");
    return utils.successResponse(result, res);
})

const getCertificate = catchAsync(async (req, res) => {
    const renderCertificate = await certificateService.getCertificate(req.params.id)
    res.message = _localize("module.get", req, "certificate")
    return utils.successResponse(renderCertificate, res)
})

module.exports = {
  partialUpdate: partialUpdate,
  list:list,
  setDefaultTemplate:setDefaultTemplate,
  getCertificate
};
