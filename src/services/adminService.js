const bcrypt = require("bcrypt");
const { createTokenWithExpiration } = require("../utils/tokenUtils");
const Admin = require("../database/models/adminModel");

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

module.exports = { adminLogIn, updateAdminEmail, updateAdminPassword };
