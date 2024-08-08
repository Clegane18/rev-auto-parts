const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");
const onlineStoreFrontCustomerController = require("../controllers/onlineStoreFrontCustomerController");
const {
  signUpValidation,
  loginValidation,
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
router.use(errorHandler);
module.exports = router;
