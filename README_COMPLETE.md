# 🏢 Custom Employee Portal with Zoho One Integration

A production-ready, secure web-based employee portal featuring JWT authentication and Role-Based Access Control (RBAC). Employees access Zoho applications through a single backend service account without needing individual Zoho credentials.

## ✨ Key Features

- **🔐 Secure Authentication**: JWT-based login with bcryptjs password hashing
- **👥 Role-Based Access Control (RBAC)**: Fine-grained permissions mapped to Zoho applications
- **🔒 Zoho OAuth Integration**: Secure backend service account managing all Zoho API access
- **📊 Responsive Dashboard**: Modern UI showing role-specific Zoho applications
- **👨‍💼 Admin Panel**: Comprehensive user management, role assignment, and audit logs
- **📝 Audit Logging**: Complete action tracking for compliance and security
- **🎨 Modern UI/UX**: Built with Tailwind CSS for responsive design
- **🚀 Production-Ready**: Error handling, logging, and security best practices

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  Employee Browser                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Login | Dashboard (Apps) | Admin Panel          │   │
│  │       (React + Vite + Tailwind CSS)             │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────┘
                 │ HTTPS/REST
┌────────────────▼────────────────────────────────────────┐
│           Backend (Node.js + Express)                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  JWT Auth │ RBAC Middleware │ Zoho Proxy       │   │
│  │  Admin API │ Audit Logger     │ Service Account  │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴──────────┐
        │                   │
    PostgreSQL         Zoho APIs
    Database           (People, CRM,
    (Users, Roles,     Desk, Books)
     Permissions)
```

## 🛠️ Technology Stack

| Layer              | Technologies                                      |
| ------------------ | ------------------------------------------------- |
| **Frontend**       | React 18, Vite, Tailwind CSS, React Router, Axios |
| **Backend**        | Node.js, Express.js, Sequelize ORM                |
| **Database**       | PostgreSQL 12+                                    |
| **Authentication** | JWT, bcryptjs                                     |
| **Third-party**    | Zoho One APIs                                     |

## 📋 Prerequisites

### System Requirements

- **Node.js** v16 or higher
- **npm** v8 or higher
- **PostgreSQL** v12 or higher (or MySQL/MongoDB)
- **Git** for version control
- **Postman** or **Insomnia** (optional, for API testing)

### Zoho Setup

- Free [Zoho One Trial Account](https://www.zoho.com/one/free-trial/)
- API Console access at https://api-console.zoho.com/
- Generated Zoho Client ID, Client Secret, and Refresh Token

## 🚀 Installation & Setup

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd employee-portal
```

### Step 2: Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Zoho API Credentials

1. Visit [Zoho API Console](https://api-console.zoho.com/)
2. Click **Add Client** → Select "Server-based Application"
3. Fill in details:
   - **Client Name**: Employee Portal
   - **Homepage URL**: http://localhost:3000
   - **Authorized Redirect URI**: http://localhost:5000/callback
4. Copy the generated **Client ID** and **Client Secret**
5. Generate a **Refresh Token** using the OAuth flow (request these scopes):
   ```
   ZohoPeople.employee.ALL
   ZohoCRM.modules.ALL
   Desk.tickets.ALL
   ZohoBooks.fullaccess.all
   ```

#### Setup Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and populate:

```env
# Server
PORT=5000
NODE_ENV=development
JWT_SECRET=your_very_long_random_secret_key_here
JWT_EXPIRES_IN=8h

# PostgreSQL Database
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_portal
DB_USER=postgres
DB_PASSWORD=postgres

# Zoho OAuth (from API Console)
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com
ZOHO_API_DOMAIN=https://www.zohoapis.com
ZOHO_CLIENT_ID=your_client_id_from_console
ZOHO_CLIENT_SECRET=your_client_secret_from_console
ZOHO_REFRESH_TOKEN=your_generated_refresh_token
```

#### Initialize Database

Using Docker Compose (recommended):

```bash
cd ..
docker-compose up -d
```

Or manually create PostgreSQL database:

```bash
createdb employee_portal
```

#### Seed Database

```bash
cd backend
npm run seed
```

This creates:

- Roles: Admin, HR, Sales, Support, Finance
- Permissions: Zoho application access permissions
- Demo Users:
  - **Admin**: admin@company.com / Admin@123
  - **HR**: hr@company.com / Hr@12345

#### Start Backend Server

```bash
npm run dev
```

✅ Backend running at `http://localhost:5000`

### Step 3: Frontend Setup

#### Install Dependencies

```bash
cd ../frontend
npm install
```

#### Configure Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Development Server

```bash
npm run dev
```

✅ Frontend running at `http://localhost:5173`

### Step 4: Access Portal

Open browser: **http://localhost:5173**

**Login with Demo Credentials:**

```
Email:    admin@company.com
Password: Admin@123
```

## 📚 API Endpoints

### Authentication

#### POST `/api/auth/login`

User login endpoint.

**Request Body:**

```json
{
  "email": "admin@company.com",
  "password": "Admin@123"
}
```

**Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Portal Admin",
    "email": "admin@company.com",
    "roles": ["Admin"],
    "permissions": ["zoho:people:access", "admin:manage_users", ...]
  }
}
```

#### GET `/api/auth/me`

Get current authenticated user.

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**

```json
{
  "user": {
    "id": "...",
    "email": "admin@company.com",
    "roles": ["Admin"],
    "permissions": [...]
  }
}
```

### Admin Management (Admin Only)

#### GET `/api/admin/users`

List all users with roles.

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@company.com",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "Roles": [{ "id": "uuid", "name": "HR" }]
  }
]
```

#### POST `/api/admin/users`

Create new user.

**Request:**

```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "password": "SecurePass123!",
  "roleIds": ["role-uuid-1", "role-uuid-2"]
}
```

**Response (201 Created):**

```json
{
  "id": "new-user-uuid",
  "name": "Jane Smith",
  "email": "jane@company.com"
}
```

#### PATCH `/api/admin/users/:userId/roles`

Update user's roles.

**Request:**

```json
{
  "roleIds": ["role-uuid-1"]
}
```

#### GET `/api/admin/roles`

List all roles with permissions.

**Response:**

```json
[
  {
    "id": "role-uuid",
    "name": "HR",
    "Permissions": [
      {
        "id": "perm-uuid",
        "key": "zoho:people:access",
        "description": "Access Zoho People"
      }
    ]
  }
]
```

#### GET `/api/admin/audit-logs`

Get system audit logs (last 200 entries).

**Response:**

```json
[
  {
    "id": "log-uuid",
    "userId": "user-uuid",
    "action": "LOGIN_SUCCESS",
    "details": { "email": "admin@company.com" },
    "ipAddress": "192.168.1.100",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### Zoho Integration

#### GET `/api/zoho/my-apps`

Get list of Zoho apps user can access.

**Response:**

```json
{
  "apps": [
    {
      "role": "Admin",
      "app": "Zoho People",
      "apiBase": "/people/api"
    },
    {
      "role": "Finance",
      "app": "Zoho Books",
      "apiBase": "/books/v3"
    }
  ]
}
```

#### GET/POST/PUT/DELETE `/api/zoho/proxy/:role/*`

Proxy requests to Zoho APIs. Only accessible if user has the specified role.

**Example:**

```bash
GET /api/zoho/proxy/HR/employees
```

Backend automatically:

- Validates user has HR role
- Gets fresh Zoho access token (cached)
- Proxies request to Zoho
- Returns response

## 🔐 Security Architecture

### Authentication Flow

```
User Login
    ↓
Password Verification (bcryptjs)
    ↓
JWT Token Generation (8h expiry)
    ↓
Token Stored in localStorage
    ↓
Every API Request
    ↓
Middleware: Verify Token Signature
    ↓
Middleware: Check User Roles/Permissions
    ↓
Route Handler (Authorized ✓)
```

### Role-Based Access Control (RBAC)

```javascript
// Middleware example:
app.get(
  "/admin/users",
  authenticate, // Verify JWT
  requireRole("Admin"), // Check role
  adminController.listUsers, // Only if authorized
);
```

### Zoho OAuth Security

```
Portal User Login
    ↓
JWT Token (Portal Credentials)
    ↓
Request to Backend (/zoho/my-apps)
    ↓
Backend Service Account
    ↓
Refresh Token → Access Token (cached)
    ↓
Proxy to Zoho API
    ↓
Never: Frontend sees Zoho credentials
✓ Single service account for all users
✓ User-specific Zoho access not needed
```

## 🗄️ Database Schema

### Users

```sql
id (UUID) | name | email | passwordHash | isActive | createdAt | updatedAt
```

### Roles

```sql
id (UUID) | name | createdAt | updatedAt
-- Values: Admin, HR, Sales, Support, Finance
```

### Permissions

```sql
id (UUID) | key | description | createdAt | updatedAt
-- Examples:
-- zoho:people:access → Access Zoho People
-- zoho:crm:access → Access Zoho CRM
-- admin:manage_users → Manage portal users
```

### UserRole (Join Table)

```sql
UserId (UUID FK) | RoleId (UUID FK)
```

### RolePermission (Join Table)

```sql
RoleId (UUID FK) | PermissionId (UUID FK)
```

### AuditLogs

```sql
id (UUID) | userId (UUID) | action | details (JSONB) | ipAddress | createdAt
-- Actions: LOGIN_SUCCESS, LOGIN_FAILED, USER_CREATED, ZOHO_ACCESS_DENIED, etc.
```

## 📊 Role-to-Zoho Mapping

| Portal Role | Zoho App    | Permission         | API Base    |
| ----------- | ----------- | ------------------ | ----------- |
| **Admin**   | All         | admin:manage_users | N/A         |
| **HR**      | Zoho People | zoho:people:access | /people/api |
| **Sales**   | Zoho CRM    | zoho:crm:access    | /crm/v3     |
| **Support** | Zoho Desk   | zoho:desk:access   | /desk/v1    |
| **Finance** | Zoho Books  | zoho:books:access  | /books/v3   |

## 🧪 Testing the APIs

### Using Postman

1. **Import Collection**: Create requests manually or import OpenAPI spec
2. **Set Base URL**: `http://localhost:5000/api`
3. **Login**:
   ```
   POST /auth/login
   Body: { "email": "admin@company.com", "password": "Admin@123" }
   ```
4. **Copy Token**: Save the returned token
5. **Set Authorization**:
   - **Type**: Bearer Token
   - **Token**: `{paste_token_here}`
6. **Test Endpoints**: Try `/admin/users`, `/zoho/my-apps`, etc.

### Using cURL

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"Admin@123"}'

# 2. Get Users (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer TOKEN"

# 3. Get My Apps
curl -X GET http://localhost:5000/api/zoho/my-apps \
  -H "Authorization: Bearer TOKEN"
```

## 🐛 Troubleshooting

### Backend Errors

#### "Error: connect ECONNREFUSED 127.0.0.1:5432"

**Problem**: PostgreSQL not running

**Solution**:

```bash
# Start Docker containers
docker-compose up -d

# Or start PostgreSQL manually
brew services start postgresql  # macOS
sudo service postgresql start   # Linux
```

#### "database employee_portal does not exist"

**Problem**: Database not created

**Solution**:

```bash
createdb employee_portal
cd backend && npm run seed
```

#### "Failed to retrieve Zoho Access Token"

**Problem**: Invalid Zoho credentials

**Solution**:

1. Verify ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET in .env
2. Check ZOHO_REFRESH_TOKEN is valid
3. Ensure Zoho account is active
4. Try regenerating refresh token

### Frontend Errors

#### "CORS error: No 'Access-Control-Allow-Origin' header"

**Problem**: Backend CORS not configured for frontend origin

**Solution**:

- Backend already allows CORS
- Verify backend is running on port 5000
- Check VITE_API_URL matches backend URL

#### "GET /api/auth/login 404 Not Found"

**Problem**: Backend routes not found

**Solution**:

- Ensure backend is running: `npm run dev` in backend folder
- Check port is 5000

#### "Cannot POST to undefined"

**Problem**: VITE_API_URL not configured

**Solution**:

```bash
cd frontend
cp .env.example .env
# Edit .env and set VITE_API_URL=http://localhost:5000/api
npm run dev
```

### Authentication Issues

#### "Invalid Token" error

**Problem**: JWT expired or corrupted

**Solution**:

- Clear localStorage: `localStorage.clear()`
- Log in again
- Check JWT_SECRET matches in backend

#### "Forbidden: insufficient role" (403)

**Problem**: User doesn't have required role

**Solution**:

- Go to Admin Panel
- Update user's roles
- Log out and log in again

## 📦 Production Deployment

### Environment Configuration

Create production `.env`:

```env
NODE_ENV=production
PORT=8000
JWT_SECRET=<generate-very-long-random-string>
JWT_EXPIRES_IN=8h

# Production Database
DB_DIALECT=postgres
DB_HOST=prod-db.example.com
DB_PORT=5432
DB_NAME=employee_portal_prod
DB_USER=prod_user
DB_PASSWORD=<strong-password>

# Zoho Credentials
ZOHO_CLIENT_ID=<from-console>
ZOHO_CLIENT_SECRET=<from-console>
ZOHO_REFRESH_TOKEN=<from-console>
```

### Deployment Steps

#### Backend (Node.js)

```bash
# 1. Install production dependencies
npm install --production

# 2. Build (if applicable)
npm run build

# 3. Run migrations/seed (if needed)
npm run seed

# 4. Start server
npm start

# Use process manager (recommended)
npm install -g pm2
pm2 start server.js --name "employee-portal"
```

#### Frontend (React)

```bash
# 1. Build
npm run build

# 2. Deploy dist/ folder to:
#    - AWS S3 + CloudFront
#    - Vercel
#    - Netlify
#    - Your web server

# 3. Update VITE_API_URL to production API URL
```

#### Database Backup

```bash
# Regular backups
pg_dump employee_portal > backup_$(date +%Y%m%d).sql

# Restore from backup
psql employee_portal < backup_20240115.sql
```

## 📝 Audit Log Examples

### Successful Login

```json
{
  "action": "LOGIN_SUCCESS",
  "details": { "email": "admin@company.com" },
  "ipAddress": "203.0.113.42",
  "createdAt": "2024-01-15T14:30:00Z"
}
```

### Failed Login

```json
{
  "action": "LOGIN_FAILED",
  "details": { "email": "user@company.com" },
  "ipAddress": "203.0.113.45",
  "createdAt": "2024-01-15T14:31:15Z"
}
```

### User Created

```json
{
  "action": "USER_CREATED",
  "details": {
    "targetEmail": "john.doe@company.com",
    "roleIds": ["role-uuid-1"]
  },
  "ipAddress": "203.0.113.42",
  "createdAt": "2024-01-15T14:35:00Z"
}
```

### Roles Updated

```json
{
  "action": "USER_ROLES_UPDATED",
  "details": {
    "targetUserId": "user-uuid",
    "roleIds": ["role-uuid-1", "role-uuid-2"]
  },
  "ipAddress": "203.0.113.42",
  "createdAt": "2024-01-15T14:40:00Z"
}
```

### Zoho Access Attempted

```json
{
  "action": "ZOHO_PROXY_REQUEST",
  "details": { "role": "HR", "subPath": "/employees" },
  "ipAddress": "203.0.113.42",
  "createdAt": "2024-01-15T14:45:00Z"
}
```

### Access Denied

```json
{
  "action": "ZOHO_ACCESS_DENIED",
  "details": { "attemptedRole": "Finance" },
  "ipAddress": "203.0.113.43",
  "createdAt": "2024-01-15T14:50:00Z"
}
```

## 🎯 Video Recording Guide

For project submission, create a 3-5 minute video covering:

### 1. Project Overview (30 seconds)

- Show portal homepage
- Explain the purpose
- Demo login flow

### 2. Login & Dashboard (1 minute)

- Login as Admin
- Show dashboard with all Zoho apps
- Login as HR user
- Show HR only sees Zoho People app
- Explain role-based access

### 3. Admin Panel (1 minute)

- Show Users tab: list of all users
- Show role assignment
- Show Roles tab: roles and permissions
- Show Audit Logs tab: system activity

### 4. RBAC & Security (1 minute)

- Explain role-to-app mapping
- Show backend code: rbac.js middleware
- Explain how permissions are checked

### 5. Zoho Integration (1 minute)

- Explain backend service account model
- Show zohoService.js: token caching
- Show zohoController.js: proxy endpoint
- Emphasize: frontend never sees Zoho credentials

### 6. Database & Audit (30 seconds)

- Show database schema
- Demonstrate audit logs
- Explain compliance tracking

## 📚 Additional Resources

- [Zoho One API Documentation](https://www.zoho.com/developer/api/)
- [JWT.io - JWT Debugger](https://jwt.io/)
- [Sequelize ORM Documentation](https://sequelize.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🙋 Support & Questions

- Review [Troubleshooting](#troubleshooting) section
- Check backend logs: `tail -f backend/debug.log`
- Check API responses in Postman
- Open an issue on GitHub

---

**Built with ❤️ for secure, scalable employee portal management**

**Last Updated**: January 2024
**Version**: 1.0.0
