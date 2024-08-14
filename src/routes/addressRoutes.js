const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const errorHandler = require("../middlewares/errorHandler");
const { checkAuthorization } = require("../utils/tokenUtils");
const { authenticateToken } = require("../middlewares/jwtMiddleware");
const {
  addAddressValidation,
  updateAddressValidation,
} = require("../middlewares/validators");

router.post(
  "/addAddress/:id",
  authenticateToken,
  addAddressValidation,
  checkAuthorization,
  addressController.addAddress
);

router.put(
  "/updateAddress/:addressId",
  authenticateToken,
  updateAddressValidation,
  checkAuthorization,
  addressController.updateAddress
);

router.use(errorHandler);
module.exports = router;
