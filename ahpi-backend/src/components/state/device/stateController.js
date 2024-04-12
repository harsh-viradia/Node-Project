const stateService = require("../stateServices");

const getList = catchAsync(async (req, res) => {
  const result = await stateService.getList(req.body)
  res.message = _localize("module.list", req, "state");
  return utils.successResponse(result, res);
});

module.exports = {
  getList,
};
