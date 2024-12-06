const AuditLog = require("../database/models/auditLog");

const auditLogger = (action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admins only." });
      }

      const actionDescription =
        typeof action === "function" ? action(req) : action;

      await AuditLog.create({
        adminId: req.user.id,
        action: actionDescription,
      });

      next();
    } catch (error) {
      console.error("Audit Logging Failed:", error);
      next();
    }
  };
};

module.exports = auditLogger;
