const axios = require('axios');

// In-memory cache for the backend service account's access token.
// A single service account manages Zoho API access for ALL employees -
// individual employees never authenticate with Zoho directly.
let cachedToken = null;
let tokenExpiryMs = 0;

// Maps portal roles -> the Zoho app each role is allowed to open, and the
// base API path used when proxying requests for that app.
const ROLE_ZOHO_MAP = {
  HR: { app: 'Zoho People', apiBase: '/people/api' },
  Sales: { app: 'Zoho CRM', apiBase: '/crm/v3' },
  Support: { app: 'Zoho Desk', apiBase: '/desk/v1' },
  Finance: { app: 'Zoho Books', apiBase: '/books/v3' },
};

async function getServiceAccountAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiryMs - 60000) {
    return cachedToken; // reuse cached token until ~1 min before expiry
  }

  const { ZOHO_ACCOUNTS_URL, ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN } = process.env;

  const response = await axios.post(`${ZOHO_ACCOUNTS_URL}/oauth/v2/token`, null, {
    params: {
      refresh_token: ZOHO_REFRESH_TOKEN,
      client_id: ZOHO_CLIENT_ID,
      client_secret: ZOHO_CLIENT_SECRET,
      grant_type: 'refresh_token',
    },
  });

  cachedToken = response.data.access_token;
  tokenExpiryMs = Date.now() + (response.data.expires_in || 3600) * 1000;
  return cachedToken;
}

// Proxies an authorized request to the correct Zoho service on behalf of the user.
// The employee's browser never sees a Zoho token - only the backend does.
async function proxyToZoho(role, path, method = 'GET', data = null) {
  const mapping = ROLE_ZOHO_MAP[role];
  if (!mapping) {
    throw Object.assign(new Error(`No Zoho app mapped for role: ${role}`), { status: 403 });
  }

  const accessToken = await getServiceAccountAccessToken();
  const url = `${process.env.ZOHO_API_DOMAIN}${mapping.apiBase}${path}`;

  const response = await axios({
    url,
    method,
    data,
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
  });

  return response.data;
}

function getAuthorizedApp(role) {
  return ROLE_ZOHO_MAP[role] || null;
}

module.exports = { getServiceAccountAccessToken, proxyToZoho, getAuthorizedApp, ROLE_ZOHO_MAP };
