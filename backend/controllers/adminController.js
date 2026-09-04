const bcrypt = require('bcryptjs');
const { User, Role, Permission, AuditLog } = require('../models');
const { logAction } = require('../services/auditService');

async function listUsers(req, res) {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'isActive', 'createdAt'],
    include: { model: Role, attributes: ['id', 'name'] },
  });
  res.json(users);
}

async function createUser(req, res) {
  const { name, email, password, roleIds = [] } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  if (roleIds.length) {
    const roles = await Role.findAll({ where: { id: roleIds } });
    await user.setRoles(roles);
  }
  await logAction(req.auth.id, 'USER_CREATED', { targetEmail: email, roleIds }, req.ip);
  res.status(201).json({ id: user.id, name: user.name, email: user.email });
}

async function updateUserRoles(req, res) {
  const { userId } = req.params;
  const { roleIds } = req.body;
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const roles = await Role.findAll({ where: { id: roleIds } });
  await user.setRoles(roles);

  await logAction(req.auth.id, 'USER_ROLES_UPDATED', { targetUserId: userId, roleIds }, req.ip);
  res.json({ message: 'Roles updated' });
}

async function listRoles(req, res) {
  const roles = await Role.findAll({ include: [Permission] });
  res.json(roles);
}

async function listAuditLogs(req, res) {
  const logs = await AuditLog.findAll({ order: [['createdAt', 'DESC']], limit: 200 });
  res.json(logs);
}

module.exports = { listUsers, createUser, updateUserRoles, listRoles, listAuditLogs };
