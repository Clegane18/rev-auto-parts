const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const errorHandler = require("../middlewares/errorHandler");
const {
  adminLogInValidation,
  updateAdminEmailValidation,
  updateAdminPasswordValidation,
} = require("../middlewares/validators");

router.post("/logInAdmin", adminLogInValidation, adminController.adminLogIn);

router.put(
  "/:adminId/update-email",
  updateAdminEmailValidation,
  adminController.updateAdminEmail
);

router.put(
  "/:adminId/update-password",
  updateAdminPasswordValidation,
  adminController.updateAdminPassword
);

router.use(errorHandler);

module.exports = router;
