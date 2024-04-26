const jwt = require("jsonwebtoken");
const { SecretKey } = require("../middlewares/jwtMiddleware");
const secretKey = SecretKey;

const createTokenWithExpiration = (payload, expiresIn) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

module.exports = { createTokenWithExpiration };
