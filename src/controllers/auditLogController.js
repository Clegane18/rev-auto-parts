const auditLogService = require("../services/auditLogService");

const getAllAuditLogs = async (req, res) => {
  try {
    const result = await auditLogService.getAllAuditLogs();

    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error in getAllAuditLogs controller:", error);
    res
      .status(error.status || 500)
      .json({ message: "Failed to retrieve audit logs" });
  }
};

const getAuditLogsByDateRange = async (req, res) => {
  try {
    const result = await auditLogService.getAuditLogsByDateRange({
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    });

    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error in getAuditLogsByDateRange controller:", error);
    res
      .status(error.status || 500)
      .json({ message: "Failed to retrieve audit logs" });
  }
};
module.exports = {
  getAllAuditLogs,
  getAuditLogsByDateRange,
};
