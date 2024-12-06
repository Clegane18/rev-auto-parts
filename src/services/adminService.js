const bcrypt = require("bcrypt");
const { createTokenWithExpiration } = require("../utils/tokenUtils");
const Admin = require("../database/models/adminModel");

const createAdminAccount = async ({ email, password }) => {
  try {
    if (!email || !password) {
      return {
        status: 400,
        message: "Email and password are required.",
      };
    }

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return {
        status: 409,
        message: "An admin with this email already exists.",
      };
    }

    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
    });

    return {
      status: 201,
      message: "Admin account created successfully.",
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        createdAt: newAdmin.createdAt,
      },
    };
  } catch (error) {
    console.error("Error in createAdminAccount service:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return {
        status: 409,
        message: "An admin with this email already exists.",
      };
    }

    return {
      status: 500,
      message: "An unexpected error occurred while creating the admin account.",
    };
  }
};

const adminLogIn = async ({ email, password }) => {
  try {
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return {
        status: 404,
        message: `Incorrect email`,
      };
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return {
        status: 401,
        message: "Incorrect password.",
      };
    }

    const token = createTokenWithExpiration(
      {
        id: admin.id,
        email: admin.email,
        role: "admin",
      },
      "1h"
    );

    return {
      status: 200,
      message: "Successful log in.",
      token: token,
    };
  } catch (error) {
    console.error("Error in adminLogIn service:", error);
    throw {
      status: 500,
      message: "An unexpected error occurred during admin login.",
    };
  }
};

const updateAdminEmail = async ({ adminId, newEmail }) => {
  try {
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return {
        status: 404,
        message: "Admin not found.",
      };
    }

    const emailInUse = await Admin.findOne({ where: { email: newEmail } });
    if (emailInUse && emailInUse.id !== adminId) {
      return {
        status: 409,
        message: "The new email is already in use by another admin.",
      };
    }

    admin.email = newEmail;
    await admin.save();

    return {
      status: 200,
      message: "Email updated successfully.",
    };
  } catch (error) {
    console.error("Error in updateAdminEmail service:", error);
    throw {
      status: 500,
      message: "An unexpected error occurred while updating the email.",
    };
  }
};

const updateAdminPassword = async ({ adminId, oldPassword, newPassword }) => {
  try {
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return {
        status: 404,
        message: "Admin not found.",
      };
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);

    if (!isMatch) {
      return {
        status: 400,
        message: "Old password is incorrect.",
      };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedNewPassword;
    await admin.save();

    return {
      status: 200,
      message: "Password updated successfully.",
    };
  } catch (error) {
    console.error("Error in updateAdminPassword service:", error);
    throw {
      status: 500,
      message: "An unexpected error occurred while updating the password.",
    };
  }
};

const deleteAdminById = async ({ adminId }) => {
  try {
    const admin = await Admin.findByPk(adminId);

    await admin.destroy();

    return {
      status: 200,
      message: "Customer deleted successfully.",
      data: { adminId },
    };
  } catch (error) {
    console.error("Error in deleteCustomerById service:", error);

    throw {
      status: 500,
      data: { message: "Error deleting customer." },
    };
  }
};

module.exports = {
  adminLogIn,
  updateAdminEmail,
  updateAdminPassword,
  createAdminAccount,
  deleteAdminById,
};
