const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const errorHandler = require("../middlewares/errorHandler");

//add log in router
//update the password or email
//log out

router.post("/logInAdmin", adminController.adminLogIn);
router.post("/logInSuperAdmin", adminController.superAdminLogIn);

router.use(errorHandler);

module.exports = router;
