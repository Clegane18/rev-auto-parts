const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const errorHandler = require("../middlewares/errorHandler");

router.post("/logInAdmin", adminController.adminLogIn);

router.use(errorHandler);

module.exports = router;
