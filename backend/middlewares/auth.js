const { verifyToken } = require('../utils/jwt');

// Verifies the JWT and attaches decoded user info (id, roles, permissions) to req.auth
module.exports = function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing authentication token' });
  }

  try {
    const decoded = verifyToken(token);
    req.auth = decoded; // { id, email, roles: [...], permissions: [...] }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
