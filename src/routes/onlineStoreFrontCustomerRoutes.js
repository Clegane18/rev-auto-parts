const express = require("express");
const router = express.Router();
const onlineStoreFrontCustomerController = require("../controllers/onlineStoreFrontCustomerController");
const {
  signUpValidation,
  loginValidation,
  updateCustomerValidation,
  requestResetPasswordValidation,
  resetPasswordValidation,
  requestChangePasswordValidation,
  changePasswordValidation,
  updatePasswordValidation,
} = require("../middlewares/validators");
const { checkAuthorization } = require("../utils/tokenUtils");
const { authenticateToken } = require("../middlewares/jwtMiddleware");

router.post(
  "/signUp",
  signUpValidation,
  onlineStoreFrontCustomerController.signUp
);

router.post("/verify-pin", onlineStoreFrontCustomerController.verifyPin);

router.post(
  "/resend-pin",
  onlineStoreFrontCustomerController.resendVerificationLink
);

router.post(
  "/login",
  loginValidation,
  onlineStoreFrontCustomerController.login
);

router.post(
  "/request-reset-password",
  requestResetPasswordValidation,
  onlineStoreFrontCustomerController.requestResetPassword
);

router.post(
  "/reset-password/:token",
  resetPasswordValidation,
  onlineStoreFrontCustomerController.resetPassword
);

router.post(
  "/reset-password/:token",
  onlineStoreFrontCustomerController.resetPassword
);

router.get(
  "/profile/:id",
  authenticateToken,
  checkAuthorization,
  onlineStoreFrontCustomerController.getCustomerProfile
);

router.put(
  "/profile/update/:id",
  authenticateToken,
  checkAuthorization,
  updateCustomerValidation,
  onlineStoreFrontCustomerController.updateCustomerById
);

router.get("/customers", onlineStoreFrontCustomerController.getAllCustomers);

router.put(
  "/customers/:customerId/account-status/toggle-status",
  onlineStoreFrontCustomerController.toggleCustomerStatus
);

router.get(
  "/order-history/:customerId",
  onlineStoreFrontCustomerController.getCustomerOnlinePurchaseHistory
);

router.delete(
  "/delete-account/:customerId",
  onlineStoreFrontCustomerController.deleteCustomerById
);

router.post(
  "/request-change-password",
  requestChangePasswordValidation,
  onlineStoreFrontCustomerController.requestChangePassword
);

router.post(
  "/change-password/:token",
  changePasswordValidation,
  onlineStoreFrontCustomerController.changePassword
);

router.post(
  "/verify-old-password",
  authenticateToken,
  checkAuthorization,
  onlineStoreFrontCustomerController.verifyOldPassword
);

router.post(
  "/update-password",
  authenticateToken,
  checkAuthorization,
  updatePasswordValidation,
  onlineStoreFrontCustomerController.updatePassword
);

router.get(
  "/password-change-method",
  authenticateToken,
  checkAuthorization,
  onlineStoreFrontCustomerController.getPasswordChangeMethod
);

module.exports = router;
