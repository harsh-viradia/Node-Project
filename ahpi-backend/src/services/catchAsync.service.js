const {
  RESPONSE_CODE,
} = require("../configuration/constants/responseCodeConstant");
const responseCode = require("../helper/utils/responseCode");
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    logger.error(err.message);
    res.status(responseCode.internalServerError).json({
      code: RESPONSE_CODE.ERROR,
      message: err.message,
      data: {},
    });
  });
};

module.exports = catchAsync;
