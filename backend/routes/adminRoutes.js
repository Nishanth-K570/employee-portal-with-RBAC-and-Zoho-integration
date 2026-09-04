const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');
const admin = require('../controllers/adminController');

router.use(authenticate, requireRole('Admin'));

router.get('/users', admin.listUsers);
router.post('/users', admin.createUser);
router.patch('/users/:userId/roles', admin.updateUserRoles);
router.get('/roles', admin.listRoles);
router.get('/audit-logs', admin.listAuditLogs);

module.exports = router;
