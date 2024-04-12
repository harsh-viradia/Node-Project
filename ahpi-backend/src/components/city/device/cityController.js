const cityService = require("../cityServices");

const getList = catchAsync(async (req, res) => {
  const result = await cityService.getList(req.body)
  res.message = _localize("module.list", req, "city");
  return utils.successResponse(result, res);
});

module.exports = {
  getList,
};
