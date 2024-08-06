const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");
const onlineStoreFrontCustomerController = require("../controllers/onlineStoreFrontCustomerController");
const {
  signUpValidation,
  loginValidation,
} = require("../middlewares/validators");

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

router.use(errorHandler);
module.exports = router;
