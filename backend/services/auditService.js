const { AuditLog } = require('../models');

async function logAction(userId, action, details = {}, ipAddress = null) {
  try {
    await AuditLog.create({ userId, action, details, ipAddress });
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
}

module.exports = { logAction };
