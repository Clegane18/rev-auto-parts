const AuditLog = require("../database/models/auditLog");
const Admin = require("../database/models/adminModel");
const { Op } = require("sequelize");

const getAllAuditLogs = async () => {
  try {
    const auditLogs = await AuditLog.findAll({
      order: [["id", "DESC"]],
      include: [
        {
          model: Admin,
          as: "admin",
          attributes: ["email"],
        },
      ],
    });

    return {
      status: 200,
      data: auditLogs,
    };
  } catch (error) {
    console.error("Error in getAllAuditLogs service:", error);
    throw error;
  }
};

const getAuditLogsByDateRange = async ({ startDate, endDate }) => {
  try {
    if (!startDate || !endDate) {
      return {
        status: 400,
        data: { message: "Start date and end date are required." },
      };
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
      return {
        status: 400,
        data: {
          message:
            "Invalid date format. Please use a valid date format (e.g., YYYY-MM-DD).",
        },
      };
    }

    if (parsedStartDate > parsedEndDate) {
      return {
        status: 400,
        data: { message: "Start date cannot be after end date." },
      };
    }

    parsedEndDate.setHours(23, 59, 59, 999);

    const auditLogs = await AuditLog.findAll({
      where: {
        createdAt: {
          [Op.between]: [parsedStartDate, parsedEndDate],
        },
      },
      include: [
        {
          model: Admin,
          as: "admin",
          attributes: ["email"],
        },
      ],
      order: [["id", "ASC"]],
    });

    if (auditLogs.length === 0) {
      return {
        status: 200,
        data: { message: "No Audit logs in that date range." },
      };
    }
    return {
      status: 200,
      data: auditLogs,
    };
  } catch (error) {
    console.error("Error in getAuditLogsByDateRange service:", error);
    throw error;
  }
};

module.exports = {
  getAllAuditLogs,
  getAuditLogsByDateRange,
};
