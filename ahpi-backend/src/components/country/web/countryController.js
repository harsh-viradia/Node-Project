const services = require("../countryServices");

const countryList = catchAsync(async (req, res) => {
  const result = await services.getList(req.body)
  res.message = _localize("module.list", req, "country");
  return utils.successResponse(result, res);
});

const get = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await services.getCountryService(id);
  res.message = _localize("module.get", req, "country");
  return utils.successResponse(result, res);
});

module.exports = {
  countryList,
  get,
};
