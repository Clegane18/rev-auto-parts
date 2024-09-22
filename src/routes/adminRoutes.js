const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const errorHandler = require("../middlewares/errorHandler");
const {
  adminLogInValidation,
  updateAdminEmailValidation,
  updateAdminPasswordValidation,
} = require("../middlewares/validators");
const { authenticateToken } = require("../middlewares/jwtMiddleware");
const { checkAuthorization } = require("../utils/tokenUtils");

router.post("/logInAdmin", adminLogInValidation, adminController.adminLogIn);

router.put(
  "/:adminId/update-email",
  authenticateToken,
  checkAuthorization,
  updateAdminEmailValidation,
  adminController.updateAdminEmail
);

router.put(
  "/:adminId/update-password",
  authenticateToken,
  checkAuthorization,
  updateAdminPasswordValidation,
  adminController.updateAdminPassword
);

router.use(errorHandler);

module.exports = router;
