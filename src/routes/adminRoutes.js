const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const {
  adminLogInValidation,
  updateAdminEmailValidation,
  updateAdminPasswordValidation,
} = require("../middlewares/validators");
const { authenticateToken } = require("../middlewares/jwtMiddleware");
const auditLogger = require("../middlewares/auditLogger");

router.post("/createAccount", adminController.createAdminAccount);

router.post("/logInAdmin", adminLogInValidation, adminController.adminLogIn);

router.put(
  "/:adminId/update-email",
  authenticateToken,
  auditLogger("Update Admin Email"),
  updateAdminEmailValidation,
  adminController.updateAdminEmail
);

router.put(
  "/:adminId/update-password",
  authenticateToken,
  auditLogger("Update Admin Password"),
  updateAdminPasswordValidation,
  adminController.updateAdminPassword
);

router.delete("/:adminId", adminController.deleteAdminById);

module.exports = router;
