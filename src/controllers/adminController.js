const adminService = require("../services/adminService");

// const createAdminAccount = async (req, res) => {
//   try {
//     const result = await adminService.createAdminAccount({
//       email: req.body.email,
//       password: req.body.password,
//     });
//     return res.status(result.status).json(result);
//   } catch (error) {
//     console.error("Error creating admin account:", error);
//     return res
//       .status(error.status || 500)
//       .json(error.data || { message: "An unexpected error occurred" });
//   }
// };

const adminLogIn = async (req, res) => {
  try {
    const result = await adminService.adminLogIn({
      email: req.body.email,
      password: req.body.password,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error logging admin account:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const updateAdminEmail = async (req, res) => {
  try {
    const result = await adminService.updateAdminEmail({
      adminId: req.user.id,
      adminId: req.params.adminId,
      newEmail: req.body.newEmail,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error updating admin email:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const updateAdminPassword = async (req, res) => {
  try {
    const result = await adminService.updateAdminPassword({
      adminId: req.user.id,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error updating admin password:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

// const deleteAdminById = async (req, res) => {
//   try {
//     const result = await adminService.deleteAdminById({
//       adminId: req.params.adminId,
//     });
//     return res.status(result.status).json(result);
//   } catch (error) {
//     console.error("Error updating admin password:", error);
//     return res
//       .status(error.status || 500)
//       .json(error.data || { message: "An unexpected error occurred" });
//   }
// };

const adminLogout = async (req, res) => {
  try {
    const result = await adminService.adminLogout({ adminId: req.user.id });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error logging out admin:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

module.exports = {
  adminLogIn,
  updateAdminEmail,
  updateAdminPassword,
  adminLogout,
};
