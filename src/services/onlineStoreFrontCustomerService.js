const Customer = require("../database/models/customerModel");
const Address = require("../database/models/addressModel");
const Order = require("../database/models/orderModel");
const OrderItem = require("../database/models/orderItemModel");
const Product = require("../database/models/inventoryProductModel");
const bcrypt = require("bcrypt");
const { createTokenWithExpiration } = require("../utils/tokenUtils");
const { Op } = require("sequelize");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const signUp = async ({ username, email, password, confirmPassword }) => {
  try {
    if (password.trim() !== confirmPassword.trim()) {
      return {
        status: 400,
        message: "Passwords do not match. Please try again.",
      };
    }

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
      emailVerified: false,
    });

    const pin = Math.floor(100000 + Math.random() * 900000);
    const pinExpiry = Date.now() + 15 * 60 * 1000;

    newCustomer.emailVerificationPin = pin;
    newCustomer.verificationPinExpiry = pinExpiry;
    await newCustomer.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = `
      <p style="font-family: 'Montserrat', serif; text-transform: none;">
        You requested to verify your email address. Please use the following PIN to verify your email:
      </p>
      <h3 style="color: #bb0000;">${pin}</h3>
      <p style="font-family: 'Montserrat', serif; text-transform: none;">
        The PIN is valid for 15 minutes. Please enter it promptly to complete the verification.
      </p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification PIN",
      html: message,
    });

    return {
      status: 200,
      message:
        "Account successfully created. A verification PIN has been sent to your email.",
      accountInfo: newCustomer,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while creating the account.",
    };
  }
};

const verifyPin = async ({ email, pin }) => {
  try {
    const customer = await Customer.findOne({ where: { email } });

    if (!customer) {
      return {
        status: 404,
        message: `No customer found with the email ${email}.`,
      };
    }

    if (customer.emailVerified) {
      return {
        status: 400,
        message: "Your email is already verified.",
      };
    }

    if (customer.emailVerificationPin !== pin) {
      return {
        status: 400,
        message: "Invalid PIN. Please try again.",
      };
    }

    if (customer.verificationPinExpiry < Date.now()) {
      return {
        status: 400,
        message: "The PIN has expired. Please request a new one.",
      };
    }

    customer.emailVerified = true;
    customer.emailVerificationPin = null;
    customer.verificationPinExpiry = null;
    await customer.save();

    return {
      status: 200,
      message: "Email successfully verified.",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Internal server error. Please try again later.",
    };
  }
};

const resendVerificationLink = async ({ email }) => {
  try {
    const customer = await Customer.findOne({ where: { email } });

    if (!customer) {
      return {
        status: 404,
        message: `No customer found with the email ${email}.`,
      };
    }

    if (customer.emailVerified) {
      return {
        status: 400,
        message: "Your email is already verified.",
      };
    }

    const newPin = Math.floor(100000 + Math.random() * 900000);
    const pinExpiry = Date.now() + 15 * 60 * 1000;

    customer.emailVerificationPin = newPin;
    customer.verificationPinExpiry = pinExpiry;
    await customer.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = `
      <p style="font-family: 'Montserrat', serif; text-transform: none;">
        You requested to verify your email address. Please use the following PIN to verify your email:
      </p>
      <h3 style="color: #bb0000;">${newPin}</h3>
      <p style="font-family: 'Montserrat', serif; text-transform: none;">
        The PIN is valid for 15 minutes. Please enter it promptly to complete the verification.
      </p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification PIN",
      html: message,
    });

    return {
      status: 200,
      message: "A new verification PIN has been sent to your email.",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while resending verification pin for email.",
    };
  }
};

const login = async ({ email, password }) => {
  try {
    const customer = await Customer.findOne({ where: { email } });

    if (!customer) {
      return {
        status: 404,
        message: `Email not found.`,
      };
    }

    if (customer.accountStatus === "Suspended") {
      return {
        status: 403,
        message: "Your account has been suspended.",
      };
    }

    if (!customer.emailVerified) {
      return {
        status: 400,
        message:
          "Your email has not been verified. Please verify your email first.",
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

    const defaultAddress = await Address.findOne({
      where: {
        customerId: customer.id,
        isSetDefaultAddress: true,
      },
    });

    const defaultAddressId = defaultAddress ? defaultAddress.id : null;

    const token = createTokenWithExpiration(
      {
        id: customer.id,
        username: customer.username,
        email: customer.email,
        defaultAddressId,
        role: "user",
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

    const resetUrl = `https://front-end-rev-auto-parts.onrender.com/reset-password/${resetToken}`;
    const message = `
    <p style="font-family: 'Montserrat', serif; text-transform: none;">
      You requested a password reset. Please click the button below to reset your password.
    </p>
    <a href="${resetUrl}" style="
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #bb0000;
      text-decoration: none;
      border-radius: 2px;
      border: 2px solid #bb0000;
      font-family: 'Montserrat', serif;
      text-transform: none;
    ">It's me</a>
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
      attributes: ["username", "email", "phoneNumber", "gender", "dateOfBirth"],
    });

    if (!customer) {
      return {
        status: 404,
        message: `Customer with ID ${userId} not found.`,
      };
    }

    const customerData = {
      username: customer.username,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      gender: customer.gender,
      dateOfBirth: customer.dateOfBirth,
    };

    return {
      status: 200,
      data: customerData,
    };
  } catch (error) {
    console.error("Error in getCustomerProfile service:", error);
    return {
      status: 500,
      message: "Server error",
    };
  }
};

const updateCustomerById = async ({
  customerId,
  username,
  phoneNumber,
  gender,
  dateOfBirth,
}) => {
  try {
    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      throw {
        status: 404,
        data: { message: `Customer not found with ID: ${customerId}` },
      };
    }

    const updates = {
      username,
      phoneNumber,
      gender,
      dateOfBirth,
    };

    let updated = false;

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined && updates[key] !== "") {
        customer[key] = updates[key];
        updated = true;
      }
    });

    if (!updated) {
      throw {
        status: 400,
        data: { message: "At least one piece of information must be updated." },
      };
    }

    await customer.save();

    return {
      status: 200,
      message: `Customer with ID ${customerId} updated successfully.`,
      updatedCustomer: customer,
    };
  } catch (error) {
    console.error("Error in updateCustomerById service:", error);
    throw error;
  }
};

const getAllCustomers = async () => {
  try {
    const customers = await Customer.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "phoneNumber",
        "gender",
        "dateOfBirth",
        "createdAt",
        "accountStatus",
      ],
      order: [["id", "ASC"]],
    });

    if (!customers || customers.length === 0) {
      throw {
        status: 404,
        data: { message: "No customers found." },
      };
    }

    return {
      status: 200,
      message: "Customers retrieved successfully.",
      data: customers,
    };
  } catch (error) {
    console.error("Error in getAllCustomers service:", error);
    throw error;
  }
};

const toggleCustomerStatus = async ({ customerId, currentStatus }) => {
  try {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";

    const [affectedRows] = await Customer.update(
      { accountStatus: newStatus },
      { where: { id: customerId } }
    );

    if (!affectedRows) {
      throw {
        status: 404,
        data: { message: "Customer not found." },
      };
    }

    const updatedCustomer = await Customer.findByPk(customerId);

    if (!updatedCustomer) {
      throw {
        status: 404,
        data: { message: "Customer not found after update." },
      };
    }

    return {
      status: 200,
      message: `Customer status updated to ${newStatus}.`,
      data: updatedCustomer,
    };
  } catch (error) {
    console.error("Error in toggleCustomerStatus service:", error);
    throw {
      status: 500,
      data: { message: "Error updating customer status." },
    };
  }
};

const getCustomerOnlinePurchaseHistory = async ({ customerId }) => {
  try {
    const orders = await Order.findAll({
      where: { customerId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["name", "price"],
            },
          ],
        },
        {
          model: Address,
          attributes: [
            "addressLine",
            "city",
            "province",
            "barangay",
            "postalCode",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!orders || orders.length === 0) {
      throw {
        status: 404,
        data: { message: "No purchase history found for this customer." },
      };
    }

    return {
      status: 200,
      message: "Customer purchase history retrieved successfully.",
      data: orders,
    };
  } catch (error) {
    console.error("Error in getCustomerOnlinePurchaseHistory service:", error);
    throw {
      status: 500,
      data: { message: "Error retrieving customer purchase history." },
    };
  }
};

const deleteCustomerById = async ({ customerId }) => {
  try {
    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      throw {
        status: 404,
        data: { message: `Customer with the ${customerId} was not found.` },
      };
    }

    await customer.destroy();

    return {
      status: 200,
      message: "Customer deleted successfully.",
      data: { customerId },
    };
  } catch (error) {
    console.error("Error in deleteCustomerById service:", error);

    throw {
      status: 500,
      data: { message: "Error deleting customer." },
    };
  }
};

const requestChangePassword = async ({ email }) => {
  try {
    const customer = await Customer.findOne({ where: { email } });

    if (!customer) {
      return {
        status: 404,
        message: `Customer with the email of ${email} was not found.`,
      };
    }

    const changeToken = crypto.randomBytes(32).toString("hex");
    const changeTokenExpiry = Date.now() + 180000; // 3 minutes from now

    customer.changePasswordToken = changeToken;
    customer.changePasswordExpires = changeTokenExpiry;
    await customer.save();

    const changeUrl = `https://front-end-rev-auto-parts.onrender.com/change-password/${changeToken}`;
    const message = `
      <p style="font-family: 'Montserrat', serif; text-transform: none;">
        You requested to change your password. Please click the button below to proceed.
      </p>
      <a href="${changeUrl}" style="
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        color: #bb0000;
        text-decoration: none;
        border-radius: 2px;
        border: 2px solid #bb0000;
        font-family: 'Montserrat', serif;
        text-transform: none;
      ">Change Password</a>
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
      subject: "Change Your Password",
      html: message,
    });

    return {
      status: 200,
      message: "Change password email sent successfully.",
    };
  } catch (error) {
    console.error("Error in requestChangePassword service:", error);
    throw error;
  }
};

const changePassword = async ({ token, newPassword, confirmPassword }) => {
  try {
    if (newPassword !== confirmPassword) {
      return {
        status: 400,
        message: "New password and confirm password do not match.",
      };
    }

    const customer = await Customer.findOne({
      where: {
        changePasswordToken: token,
        changePasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!customer) {
      return {
        status: 400,
        message: "Change password token is invalid or has expired.",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    customer.password = hashedPassword;

    customer.changePasswordToken = null;
    customer.changePasswordExpires = null;

    await customer.save();

    return {
      status: 200,
      message: "Password has been successfully updated.",
    };
  } catch (error) {
    console.error("Error in changePassword service:", error);
    throw error;
  }
};

const verifyOldPassword = async ({ customerId, oldPassword }) => {
  try {
    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      return {
        status: 404,
        message: "Customer not found.",
      };
    }

    if (!customer.password) {
      return {
        status: 400,
        message:
          "This account does not have a password set. Please use the password reset option.",
      };
    }

    const isMatch = await bcrypt.compare(oldPassword, customer.password);

    if (!isMatch) {
      return {
        status: 400,
        message: "Old password is incorrect.",
      };
    }

    return {
      status: 200,
      message: "Old password verified successfully.",
    };
  } catch (error) {
    console.error("Error in verifyOldPassword service:", error);
    throw error;
  }
};

const updatePassword = async ({ customerId, newPassword, confirmPassword }) => {
  try {
    if (newPassword !== confirmPassword) {
      return {
        status: 400,
        message: "New password and confirm password do not match.",
      };
    }

    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      return {
        status: 404,
        message: "Customer not found.",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    customer.password = hashedPassword;

    await customer.save();

    return {
      status: 200,
      message: "Password has been successfully updated.",
    };
  } catch (error) {
    console.error("Error in updatePassword service:", error);
    throw error;
  }
};

const getPasswordChangeMethod = async ({ customerId }) => {
  try {
    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      return {
        status: 404,
        message: "Customer not found.",
      };
    }

    if (customer.password) {
      return {
        status: 200,
        method: "oldPassword",
      };
    }

    if (customer.googleId) {
      return {
        status: 200,
        method: "email",
      };
    }
    return {
      status: 400,
      message: "Unable to determine account type.",
    };
  } catch (error) {
    console.error("Error in getPasswordChangeMethod service:", error);
    throw error;
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
