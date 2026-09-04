const bcrypt = require('bcryptjs');
const { User, Role, Permission } = require('../models');
const { signToken } = require('../utils/jwt');
const { logAction } = require('../services/auditService');

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await User.findOne({
    where: { email },
    include: { model: Role, include: [Permission] },
  });

  if (!user || !user.isActive) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    await logAction(user.id, 'LOGIN_FAILED', { email }, req.ip);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const roles = user.Roles.map((r) => r.name);
  const permissions = [
    ...new Set(user.Roles.flatMap((r) => r.Permissions.map((p) => p.key))),
  ];

  const token = signToken({ id: user.id, email: user.email, roles, permissions });

  await logAction(user.id, 'LOGIN_SUCCESS', { email }, req.ip);

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, roles, permissions },
  });
}

async function me(req, res) {
  res.json({ user: req.auth });
}

module.exports = { login, me };
