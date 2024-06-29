const adminService = require("../services/adminService");

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

module.exports = { adminLogIn };
