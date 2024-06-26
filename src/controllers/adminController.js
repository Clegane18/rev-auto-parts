const adminService = require("../services/adminService");

const adminLogIn = async (req, res) => {
  try {
    const result = await adminService.adminLogIn({
      email: req.body.email,
      password: req.body.password,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error logging admin account:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

module.exports = { adminLogIn };
