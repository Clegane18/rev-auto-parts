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

    const token = createTokenWithExpiration(
      {
        id: newCustomer.id,
        username: newCustomer.username,
        email: newCustomer.email,
      },
      "1h"
    );

    return {
      status: 200,
      message: "Account successfully created.",
      accountInfo: newCustomer,
      token,
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
        message: `Email not found.`,
      };
    }

    if (customer.accountStatus === "Suspended") {
      return {
        status: 403,
        message: "Your account has been suspended.",
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
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #bb0000; text-decoration: none; border-radius: 2px; ">It's me</a>
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

    const updatedCustomer = await Customer.update(
      { accountStatus: newStatus },
      { where: { id: customerId }, returning: true, plain: true }
    );

    if (!updatedCustomer) {
      throw {
        status: 404,
        data: { message: "Customer not found." },
      };
    }

    return {
      status: 200,
      message: `Customer status updated to ${newStatus}.`,
      data: updatedCustomer[1],
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

module.exports = {
  signUp,
  login,
  requestResetPassword,
  resetPassword,
  getCustomerProfile,
  updateCustomerById,
  getAllCustomers,
  toggleCustomerStatus,
  getCustomerOnlinePurchaseHistory,
  deleteCustomerById,
};
