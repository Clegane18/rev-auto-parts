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

const getCustomerProfile = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.getCustomerProfile({
      userId: req.params.id,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching customer's profile:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const updateCustomerById = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.updateCustomerById({
      customerId: req.params.id,
      username: req.body.username,
      phoneNumber: req.body.phoneNumber,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error updating customer's data:", error);
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
  getCustomerProfile,
  updateCustomerById,
};
