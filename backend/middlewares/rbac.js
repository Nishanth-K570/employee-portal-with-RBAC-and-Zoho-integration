// Role-based / permission-based access control middleware.
// Usage: router.get('/x', authenticate, requireRole('Admin'), handler)
//        router.get('/y', authenticate, requirePermission('zoho:books:access'), handler)

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = req.auth?.roles || [];
    const hasRole = userRoles.some((r) => allowedRoles.includes(r));
    if (!hasRole) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };
}

function requirePermission(...allowedPermissions) {
  return (req, res, next) => {
    const userPerms = req.auth?.permissions || [];
    const hasPerm = userPerms.some((p) => allowedPermissions.includes(p));
    if (!hasPerm) {
      return res.status(403).json({ error: 'Forbidden: insufficient permission' });
    }
    next();
  };
}

module.exports = { requireRole, requirePermission };
