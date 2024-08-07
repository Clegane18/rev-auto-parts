const Customer = require("../database/models/customerModel");
const bcrypt = require("bcrypt");
const { createTokenWithExpiration } = require("../utils/tokenUtils");
const { Op } = require("sequelize");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const signUp = async ({ username, email, password }) => {
  try {
    const existingCustomer = await Customer.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingCustomer) {
      if (existingCustomer.email === email) {
        return {
          status: 400,
          message: `Customer with the email ${email} already exists.`,
        };
      }
      if (existingCustomer.username === username) {
        return {
          status: 400,
          message: `Username ${username} is already taken.`,
        };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = await Customer.create({
      username,
      email,
      password: hashedPassword,
    });

    return {
      status: 200,
      message: "Account successfully created.",
      accountInfo: newCustomer,
    };
  } catch (error) {
    console.error("Error in signUp service:", error);
    throw error;
  }
};

const login = async ({ email, password }) => {
  try {
    const customer = await Customer.findOne({ where: { email } });

    if (!customer) {
      return {
        status: 404,
        data: `Customer with the email of ${email} was not found.`,
      };
    }

    const hashedPassword = customer.password;
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatch) {
      return {
        status: 401,
        message: "Incorrect password",
      };
    }

    const token = createTokenWithExpiration(
      {
        id: customer.id,
        username: customer.username,
        email: customer.email,
      },
      "1h"
    );

    return {
      status: 200,
      message: "Successful log in",
      token: token,
    };
  } catch (error) {
    console.error("Error in login service:", error);
    throw error;
  }
};

const requestResetPassword = async ({ email }) => {
  try {
    const customer = await Customer.findOne({ where: { email } });

    if (!customer) {
      return {
        status: 404,
        message: `Customer with the email of ${email} was not found.`,
      };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 180000; // mins token before expiration

    customer.resetPasswordToken = resetToken;
    customer.resetPasswordExpires = resetTokenExpiry;
    await customer.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `
      <p>You requested a password reset. Please click the button below to reset your password.</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #0c619b; text-decoration: none; border-radius: 2px; ">It's me</a>
    `;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: customer.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      html: message,
    });

    return {
      status: 200,
      message: "Password reset email sent",
    };
  } catch (error) {
    console.error("Error in requestResetPassword service:", error);
    throw error;
  }
};

const resetPassword = async ({ token, newPassword, confirmPassword }) => {
  try {
    if (newPassword !== confirmPassword) {
      return {
        status: 400,
        message: "New password and confirm password do not match.",
      };
    }

    const customer = await Customer.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!customer) {
      return {
        status: 400,
        message: "Password reset token is invalid or has expired.",
      };
    }

    customer.password = await bcrypt.hash(newPassword, 10);
    customer.resetPasswordToken = null;
    customer.resetPasswordExpires = null;

    await customer.save();

    return {
      status: 200,
      message: "Password has been updated.",
    };
  } catch (error) {
    console.error("Error in resetPassword service:", error);
    throw error;
  }
};

const getCustomerProfile = async ({ userId }) => {
  try {
    const customer = await Customer.findByPk(userId, {
      attributes: ["username", "email"],
    });

    if (!customer) {
      return {
        status: 404,
        message: `Customer with ID ${userId} not found.`,
      };
    }

    return {
      status: 200,
      data: {
        username: customer.username,
        email: customer.email,
      },
    };
  } catch (error) {
    console.error("Error in getCustomerProfile service:", error);
    return {
      status: 500,
      message: "Server error",
    };
  }
};

module.exports = {
  signUp,
  login,
  requestResetPassword,
  resetPassword,
  getCustomerProfile,
};
