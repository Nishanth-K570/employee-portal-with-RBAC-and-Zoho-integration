# Custom Employee Portal with Zoho One Integration

A web-based employee portal with custom authentication (JWT), Role-Based Access
Control (RBAC), and a backend integration layer for Zoho One. Employees log in
with portal credentials only — the backend uses a single Zoho service account
(via a stored refresh token) to talk to Zoho on their behalf, so no employee
ever needs individual Zoho credentials.

## ⚡ Quick Start

Get started in 5 minutes! See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.

```bash
# 1. Install dependencies
cd backend && npm install && cd ../frontend && npm install

# 2. Create database and seed demo data
createdb employee_portal
cd backend && npm run seed

# 3. Start servers in separate terminals
cd backend && npm run dev
cd frontend && npm run dev

# 4. Open http://localhost:5173
# Login: admin@company.com / Admin@123
```

## 📚 Documentation

| Document                                           | Purpose                                          |
| -------------------------------------------------- | ------------------------------------------------ |
| [QUICKSTART.md](QUICKSTART.md)                     | 5-minute setup guide with troubleshooting        |
| [README_COMPLETE.md](README_COMPLETE.md)           | Comprehensive technical documentation            |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)           | Project overview and feature checklist           |
| [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)       | Complete API endpoint testing with cURL examples |
| [VIDEO_GUIDE.md](VIDEO_GUIDE.md)                   | 3-5 minute video recording guide                 |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | 150+ item pre-deployment verification            |

## Tech Stack

- **Frontend:** React (Vite) + React Router + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (via Sequelize ORM)
- **Auth:** JWT + bcryptjs password hashing

## Project Structure

```
employee-portal/
├── backend/
│   ├── config/db.js            # Sequelize/Postgres connection
│   ├── models/index.js         # User, Role, Permission, UserRole, RolePermission, AuditLog
│   ├── middlewares/auth.js     # JWT verification
│   ├── middlewares/rbac.js     # requireRole / requirePermission
│   ├── services/zohoService.js # Zoho OAuth token mgmt + role→app mapping + proxy
│   ├── services/auditService.js
│   ├── controllers/            # authController, adminController, zohoController
│   ├── routes/                 # authRoutes, adminRoutes, zohoRoutes
│   ├── seed.js                 # seeds roles, permissions, admin + demo user
│   └── server.js
├── frontend/
│   └── src/
│       ├── pages/Login.jsx
│       ├── pages/Dashboard.jsx
│       ├── pages/Admin.jsx
│       ├── context/AuthContext.jsx
│       └── api.js
└── docker-compose.yml           # local Postgres
```

## 1. Prerequisites

- Node.js 18+
- Docker (for local Postgres) — or your own Postgres instance
- A Zoho One free trial account

## 2. Zoho API Credentials

1. Sign up for a Zoho One free trial: https://www.zoho.com/one/
2. Go to the [Zoho API Console](https://api-console.zoho.com/) → **Add Client** → Server-based Application.
3. Note the **Client ID** and **Client Secret**.
4. Generate a refresh token using the self-client / OAuth flow with the scopes
   you need (e.g. `ZohoPeople.employee.ALL`, `ZohoCRM.modules.ALL`,
   `Desk.tickets.ALL`, `ZohoBooks.fullaccess.all`). This refresh token belongs
   to the backend service account — never distribute it to end users.

## 3. Environment Variables

Copy the example file and fill in real values:

```bash
cd backend
cp .env.example .env
```

Key variables:
| Variable | Description |
|---|---|
| `JWT_SECRET` | Long random string used to sign portal JWTs |
| `DB_*` | Postgres connection details |
| `ZOHO_CLIENT_ID` / `ZOHO_CLIENT_SECRET` | From the Zoho API Console |
| `ZOHO_REFRESH_TOKEN` | Service account refresh token |
| `ZOHO_ACCOUNTS_URL` / `ZOHO_API_DOMAIN` | Use your Zoho data-center domain (`.com`, `.eu`, `.in`, etc.) |

## 4. Database Setup

Start Postgres locally:

```bash
docker compose up -d
```

Install backend deps, then seed the database (creates roles, permissions,
an Admin user, and a demo HR user):

```bash
cd backend
npm install
npm run seed
```

Seed output gives you login credentials, e.g.:

- Admin → `admin@company.com` / `Admin@123`
- HR → `hr@company.com` / `Hr@12345`

**Change these passwords immediately in any non-local environment.**

## 5. Run the Backend

```bash
cd backend
npm run dev      # nodemon, http://localhost:5000
```

## 6. Run the Frontend

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:5000`.

## 7. How RBAC Works

1. On login, the backend looks up the user's roles and the permissions
   attached to those roles, and embeds both in the signed JWT.
2. `middlewares/auth.js` verifies the JWT on every protected request.
3. `middlewares/rbac.js` exposes `requireRole(...)` and
   `requirePermission(...)` guards used on routes (e.g. all `/api/admin/*`
   routes require the `Admin` role).
4. The frontend dashboard calls `GET /api/zoho/my-apps`, which returns only
   the Zoho apps mapped to the caller's roles, so the UI renders buttons only
   for authorized services.

## 8. How the Zoho Integration Works

- `services/zohoService.js` holds the **role → Zoho app** mapping (HR→People,
  Sales→CRM, Support→Desk, Finance→Books).
- It exchanges the service account's refresh token for a short-lived access
  token, caches it in memory, and refreshes it automatically before expiry.
- All Zoho calls are proxied through `POST/GET /api/zoho/proxy/:role/*`,
  which checks the caller actually holds `:role` (or is Admin) before forwarding
  the request — so a Sales user cannot reach Finance's Zoho Books data even by
  calling the API directly.

## 9. Deploying

Quick options for a same-day deploy:

- **Backend:** Render.com / Railway.app (Node service) + their managed Postgres add-on.
- **Frontend:** Vercel or Netlify (`npm run build` → deploy `dist/`), pointing
  API calls at your deployed backend URL (set `VITE_API_URL` and update `api.js`
  baseURL, or configure a rewrite/proxy on the host).

## 10. Submission Checklist

- [ ] Push this repo to a **public** GitHub repository
- [ ] Confirm `.env` is **not** committed (already in `.gitignore`)
- [ ] Record a 3–5 min screen capture covering: login as different roles,
      RBAC restricting dashboard buttons, a walkthrough of `zohoService.js`
      explaining the single service account, and the Admin panel
      (user/role management + audit logs)
- [ ] Add the video link and repo link to your submission form
