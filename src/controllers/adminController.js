const adminService = require("../services/adminService");
const controllerErrorHandlerUtils = require("../utils/controllerErrorHandlerUtils");

const adminLogIn = async (req, res) => {
  try {
    const result = await adminService.adminLogIn({
      email: req.body.email,
      password: req.body.password,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "adminController",
      "Error in logging Admin account."
    );
  }
};

const superAdminLogIn = async (req, res) => {
  try {
    const result = await adminService.superAdminLogIn({
      email: req.body.email,
      password: req.body.password,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "adminController",
      "Error in logging Super Admin account."
    );
  }
};

module.exports = { adminLogIn, superAdminLogIn };
