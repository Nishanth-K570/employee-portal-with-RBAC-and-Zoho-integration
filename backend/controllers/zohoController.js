const {
  proxyToZoho,
  getAuthorizedApp,
  ROLE_ZOHO_MAP,
} = require("../services/zohoService");
const { logAction } = require("../services/auditService");

// Returns the list of Zoho apps the logged-in user is authorized to open,
// based on their roles - used by the frontend to render dashboard buttons.
async function myApps(req, res) {
  const roles = req.auth.roles || [];

  const appEntries = roles.includes("Admin")
    ? Object.entries(ROLE_ZOHO_MAP).map(([role, config]) => ({
        role,
        ...config,
      }))
    : roles
        .map((role) => ({ role, ...getAuthorizedApp(role) }))
        .filter((entry) => entry.app);

  res.json({ apps: appEntries });
}

// Generic proxy endpoint: /api/zoho/:role/*  -> only reachable if the
// authenticated user actually holds that role (enforced below).
async function proxy(req, res) {
  const { role } = req.params;
  const subPath = req.params[0] ? `/${req.params[0]}` : "";

  const userRoles = req.auth.roles || [];
  if (!userRoles.includes(role) && !userRoles.includes("Admin")) {
    await logAction(
      req.auth.id,
      "ZOHO_ACCESS_DENIED",
      { attemptedRole: role },
      req.ip,
    );
    return res
      .status(403)
      .json({ error: `Not authorized for ${role} Zoho services` });
  }

  try {
    const data = await proxyToZoho(role, subPath, req.method, req.body);
    await logAction(
      req.auth.id,
      "ZOHO_PROXY_REQUEST",
      { role, subPath },
      req.ip,
    );
    res.json(data);
  } catch (err) {
    res.status(err.status || 502).json({ error: err.message });
  }
}

module.exports = { myApps, proxy };
