const jwt = require("jsonwebtoken");
const { SecretKey } = require("../middlewares/jwtMiddleware");
const secretKey = SecretKey;

const createTokenWithExpiration = (payload, expiresIn) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

const checkAuthorization = (req, res, next) => {
  const userIdFromToken = parseInt(req.user.id);
  const userIdFromParams = parseInt(req.params.id);

  if (userIdFromToken !== userIdFromParams) {
    return res.status(403).json({
      status: 403,
      message:
        "Unauthorized: Access Denied. Please check your request parameters and try again.",
    });
  }

  next();
};

module.exports = { createTokenWithExpiration, checkAuthorization };
