const validate = (validator) => {
  return async function (req, res, next) {
    try {
      req.body = await validator.validateAsync(req.body);
      next();
    } catch (err) {
      logger.error("Error - ValidationError", err);
      if (err.isJoi) return utils.inValidParam(err.message, res);
      next(utils.failureResponse(err.message, res));
    }
  };
};
module.exports = validate;
