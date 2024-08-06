const onlineStoreFrontCustomerService = require("../services/onlineStoreFrontCustomerService");

const signUp = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.signUp({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error creating customer account:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const login = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.login({
      email: req.body.email,
      password: req.body.password,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error logging customer's account:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const requestResetPassword = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.requestResetPassword({
      email: req.body.email,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error requesting for customer's password reset:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.resetPassword({
      token: req.params.token,
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error resetting customer's password:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

module.exports = {
  signUp,
  login,
  requestResetPassword,
  resetPassword,
};
