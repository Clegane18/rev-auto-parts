const onlineStoreFrontCustomerService = require("../services/onlineStoreFrontCustomerService");

const signUp = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.signUp({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error creating customer account:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const verifyPin = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.verifyPin({
      email: req.body.email,
      pin: req.body.pin,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error verifying email:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const resendVerificationLink = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.resendVerificationLink(
      {
        email: req.body.email,
      }
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error resending verification pin for email:", error);
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

const getAllCustomers = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.getAllCustomers();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching all customers:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const toggleCustomerStatus = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.toggleCustomerStatus({
      adminId: req.user.id,
      customerId: req.params.customerId,
      currentStatus: req.body.currentStatus,
    });

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error toggling customer's status:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getCustomerOnlinePurchaseHistory = async (req, res) => {
  try {
    const result =
      await onlineStoreFrontCustomerService.getCustomerOnlinePurchaseHistory({
        customerId: req.params.customerId,
      });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching customer's order history:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const deleteCustomerById = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.deleteCustomerById({
      adminId: req.user.id,
      customerId: req.params.customerId,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error deleting customer's account:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const requestChangePassword = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.requestChangePassword({
      email: req.body.email,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error requesting for customer's change password:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const changePassword = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.changePassword({
      token: req.params.token,
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error changing customer's password:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const verifyOldPassword = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.verifyOldPassword({
      customerId: req.user.id,
      oldPassword: req.body.oldPassword,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error verifying customer's old password:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const result = await onlineStoreFrontCustomerService.updatePassword({
      customerId: req.user.id,
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error verifying customer's old password:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getPasswordChangeMethod = async (req, res) => {
  try {
    const result =
      await onlineStoreFrontCustomerService.getPasswordChangeMethod({
        customerId: req.user.id,
      });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error verifying customer's password change method:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

module.exports = {
  signUp,
  verifyPin,
  resendVerificationLink,
  login,
  requestResetPassword,
  resetPassword,
  getCustomerProfile,
  updateCustomerById,
  getAllCustomers,
  toggleCustomerStatus,
  getCustomerOnlinePurchaseHistory,
  deleteCustomerById,
  requestChangePassword,
  changePassword,
  verifyOldPassword,
  updatePassword,
  getPasswordChangeMethod,
};
