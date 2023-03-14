const errorFn = require("../utils/error-fn");

module.exports = async (req, res, next) => {
  try {
    if (req.user.role !== "offer") {
      errorFn("You are unauthorized", 401);
    }
    next();
  } catch (err) {
    next(err);
  }
};
