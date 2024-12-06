const express = require("express");
const router = express.Router();
const auditLogController = require("../controllers/auditLogController");

router.get("/", auditLogController.getAllAuditLogs);
router.get("/date-range", auditLogController.getAuditLogsByDateRange);

module.exports = router;
