const jwt = require("jsonwebtoken");
const { SecretKey } = require("../middlewares/jwtMiddleware");
const secretKey = SecretKey;

const createTokenWithExpiration = (payload, expiresIn) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

const checkAuthorization = (req, res, next) => {
  if (parseInt(req.user.id) !== parseInt(req.params.id)) {
    return res.json({
      status: 403,
      data: {
        message:
          "Unauthorized: Access Denied. Please check your request parameters and try again.",
      },
    });
  }

  next();
};

module.exports = checkAuthorization;

module.exports = { createTokenWithExpiration, checkAuthorization };
