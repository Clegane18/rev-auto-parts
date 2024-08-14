const jwt = require("jsonwebtoken");
const { SecretKey } = require("../middlewares/jwtMiddleware");
const secretKey = SecretKey;
const Address = require("../database/models/Address");

const createTokenWithExpiration = (payload, expiresIn) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

const checkAuthorization = async (req, res, next) => {
  try {
    const userIdFromToken = parseInt(req.user.id);

    if (req.params.addressId) {
      const addressIdFromParams = parseInt(req.params.addressId);

      const address = await Address.findByPk(addressIdFromParams);

      if (!address) {
        return res
          .status(404)
          .json({ status: 404, message: "Address not found." });
      }

      if (address.customerId !== userIdFromToken) {
        return res.status(403).json({
          status: 403,
          message:
            "Unauthorized: Address does not belong to the specified customer.",
        });
      }
    } else if (req.params.id) {
      const userIdFromParams = parseInt(req.params.id);

      if (userIdFromToken !== userIdFromParams) {
        return res.status(403).json({
          status: 403,
          message:
            "Unauthorized: Access Denied. Please check your request parameters and try again.",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Error in checkAuthorization middleware:", error);
    return res.status(500).json({ message: "An unexpected error occurred." });
  }
};

module.exports = { createTokenWithExpiration, checkAuthorization };
