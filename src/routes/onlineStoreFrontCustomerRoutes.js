const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");
const onlineStoreFrontCustomerController = require("../controllers/onlineStoreFrontCustomerController");
const {
  signUpValidation,
  loginValidation,
  updateCustomerValidation,
} = require("../middlewares/validators");
const { checkAuthorization } = require("../utils/tokenUtils");
const { authenticateToken } = require("../middlewares/jwtMiddleware");

router.post(
  "/signUp",
  signUpValidation,
  onlineStoreFrontCustomerController.signUp
);

router.post(
  "/login",
  loginValidation,
  onlineStoreFrontCustomerController.login
);

router.post(
  "/request-reset-password",
  onlineStoreFrontCustomerController.requestResetPassword
);

router.post(
  "/reset-password/:token",
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

router.use(errorHandler);
module.exports = router;
