# 🧪 API Testing Guide

Complete guide for testing all Employee Portal API endpoints.

## Prerequisites

- Backend server running on `http://localhost:5000`
- PostgreSQL database with demo data seeded
- One of:
  - Postman (desktop/web app)
  - cURL (command line)
  - Thunder Client (VS Code extension)
  - Insomnia (REST client)

---

## 🔐 Authentication Flow

### Step 1: Get JWT Token (Login)

**POST** `http://localhost:5000/api/auth/login`

#### cURL:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "Admin@123"
  }'
```

#### Response (200 OK):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQiLCJlbWFpbCI6ImFkbWluQGNvbXBhbnkuY29tIiwicm9sZXMiOlsiQWRtaW4iXSwicGVybWlzc2lvbnMiOlsiezo6cmVhZCIsInRvOmVkaXQiXSwiaWF0IjoxNjk3NjU0MzIxLCJleHAiOjE2OTc2NzQzMjF9.sxg9Xq2K",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Admin User",
    "email": "admin@company.com",
    "roles": ["Admin"],
    "permissions": [
      "zoho:people:access",
      "zoho:crm:access",
      "zoho:desk:access",
      "zoho:books:access"
    ]
  }
}
```

#### Error Responses:

**400 Bad Request** - Missing email or password:

```json
{
  "error": "Email and password are required"
}
```

**401 Unauthorized** - Invalid credentials:

```json
{
  "error": "Invalid email or password"
}
```

**Save the token** for all subsequent requests. Copy the `token` value.

---

## 👤 User Authentication

### Get Current User Info

**GET** `http://localhost:5000/api/auth/me`

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

#### cURL:

```bash
TOKEN="your_jwt_token_here"
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

#### Response (200 OK):

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Admin User",
    "email": "admin@company.com",
    "roles": ["Admin"],
    "permissions": [
      "zoho:people:access",
      "zoho:crm:access",
      "zoho:desk:access",
      "zoho:books:access"
    ],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses:

**401 Unauthorized** - Missing or invalid token:

```json
{
  "error": "Unauthorized: invalid or missing token"
}
```

---

## 🔍 Admin Endpoints (Require Admin Role)

### List All Users

**GET** `http://localhost:5000/api/admin/users`

**Headers:**

```
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json
```

#### cURL:

```bash
TOKEN="admin_token_here"
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

#### Response (200 OK):

```json
{
  "users": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Admin User",
      "email": "admin@company.com",
      "roles": ["Admin"],
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "HR User",
      "email": "hr@company.com",
      "roles": ["HR"],
      "isActive": true,
      "createdAt": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

### Create New User

**POST** `http://localhost:5000/api/admin/users`

**Headers:**

```
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json
```

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "SecurePass@123",
  "roleIds": ["role-hr-id", "role-sales-id"]
}
```

#### cURL:

```bash
TOKEN="admin_token_here"
curl -X POST http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@company.com",
    "password": "SecurePass@123",
    "roleIds": []
  }'
```

#### Response (201 Created):

```json
{
  "user": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "name": "John Doe",
    "email": "john@company.com",
    "roles": [],
    "isActive": true,
    "createdAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "User created successfully"
}
```

#### Error Responses:

**400 Bad Request** - Missing required fields:

```json
{
  "error": "Name, email, and password are required"
}
```

**409 Conflict** - Email already exists:

```json
{
  "error": "Email already registered"
}
```

**403 Forbidden** - Not admin:

```json
{
  "error": "Forbidden: insufficient role"
}
```

### Update User Roles

**PATCH** `http://localhost:5000/api/admin/users/:userId/roles`

**Headers:**

```
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json
```

**Body:**

```json
{
  "roleIds": ["role-hr-id", "role-finance-id"]
}
```

#### cURL:

```bash
TOKEN="admin_token_here"
USER_ID="550e8400-e29b-41d4-a716-446655440001"
curl -X PATCH http://localhost:5000/api/admin/users/$USER_ID/roles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roleIds": []}'
```

#### Response (200 OK):

```json
{
  "user": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "HR User",
    "email": "hr@company.com",
    "roles": ["HR", "Finance"],
    "isActive": true
  },
  "message": "User roles updated successfully"
}
```

### List All Roles

**GET** `http://localhost:5000/api/admin/roles`

**Headers:**

```
Authorization: Bearer ADMIN_JWT_TOKEN
```

#### cURL:

```bash
TOKEN="admin_token_here"
curl -X GET http://localhost:5000/api/admin/roles \
  -H "Authorization: Bearer $TOKEN"
```

#### Response (200 OK):

```json
{
  "roles": [
    {
      "id": "role-admin-id",
      "name": "Admin",
      "permissions": [
        {
          "id": "perm-1",
          "name": "zoho:people:access",
          "description": "Access Zoho People"
        },
        {
          "id": "perm-2",
          "name": "zoho:crm:access",
          "description": "Access Zoho CRM"
        }
      ]
    },
    {
      "id": "role-hr-id",
      "name": "HR",
      "permissions": [
        {
          "id": "perm-1",
          "name": "zoho:people:access",
          "description": "Access Zoho People"
        }
      ]
    }
  ]
}
```

### Get Audit Logs

**GET** `http://localhost:5000/api/admin/audit-logs`

**Query Parameters:**

- `limit` (optional): Number of logs to return (default: 200)
- `offset` (optional): Pagination offset (default: 0)
- `action` (optional): Filter by action type

**Headers:**

```
Authorization: Bearer ADMIN_JWT_TOKEN
```

#### cURL:

```bash
TOKEN="admin_token_here"
curl -X GET "http://localhost:5000/api/admin/audit-logs?limit=50" \
  -H "Authorization: Bearer $TOKEN"
```

#### Response (200 OK):

```json
{
  "logs": [
    {
      "id": "log-1",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "action": "LOGIN_SUCCESS",
      "details": {
        "email": "admin@company.com",
        "ipAddress": "192.168.1.100"
      },
      "ipAddress": "192.168.1.100",
      "createdAt": "2024-01-15T11:05:00.000Z"
    },
    {
      "id": "log-2",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "action": "USER_CREATED",
      "details": {
        "newUserId": "770e8400-e29b-41d4-a716-446655440002",
        "newUserEmail": "john@company.com"
      },
      "ipAddress": "192.168.1.100",
      "createdAt": "2024-01-15T11:06:00.000Z"
    }
  ]
}
```

---

## 🔌 Zoho Integration Endpoints

### Get User's Accessible Apps

**GET** `http://localhost:5000/api/zoho/my-apps`

**Headers:**

```
Authorization: Bearer USER_JWT_TOKEN
```

#### cURL - Admin User (Gets 4 apps):

```bash
TOKEN="admin_token_here"
curl -X GET http://localhost:5000/api/zoho/my-apps \
  -H "Authorization: Bearer $TOKEN"
```

#### Response (200 OK) - Admin:

```json
{
  "apps": [
    {
      "role": "HR",
      "app": "Zoho People",
      "icon": "👥",
      "description": "HR Management System"
    },
    {
      "role": "Sales",
      "app": "Zoho CRM",
      "icon": "💼",
      "description": "Customer Relationship Management"
    },
    {
      "role": "Support",
      "app": "Zoho Desk",
      "icon": "🎫",
      "description": "Help Desk & Support"
    },
    {
      "role": "Finance",
      "app": "Zoho Books",
      "icon": "📊",
      "description": "Accounting Software"
    }
  ]
}
```

#### cURL - HR User (Gets 1 app):

```bash
TOKEN="hr_user_token_here"
curl -X GET http://localhost:5000/api/zoho/my-apps \
  -H "Authorization: Bearer $TOKEN"
```

#### Response (200 OK) - HR:

```json
{
  "apps": [
    {
      "role": "HR",
      "app": "Zoho People",
      "icon": "👥",
      "description": "HR Management System"
    }
  ]
}
```

### Proxy Zoho API Request

**ANY** `http://localhost:5000/api/zoho/proxy/:role/*`

**Example:** `POST /api/zoho/proxy/HR/api/modules`

**Headers:**

```
Authorization: Bearer USER_JWT_TOKEN
Content-Type: application/json
```

**Body:** (Any valid Zoho API request body)

```json
{
  "example": "request body"
}
```

#### cURL Example:

```bash
TOKEN="hr_user_token_here"
curl -X POST http://localhost:5000/api/zoho/proxy/HR/api/modules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"example": "data"}'
```

#### Response (Zoho API Response):

```json
{
  "data": "from Zoho API"
}
```

#### Error Responses:

**403 Forbidden** - User doesn't have role:

```json
{
  "error": "Not authorized for HR Zoho services"
}
```

**401 Unauthorized** - Invalid token:

```json
{
  "error": "Unauthorized: invalid or missing token"
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Admin Workflow

```bash
# 1. Login as admin
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"Admin@123"}' \
  | jq -r '.token')

echo "Token: $TOKEN"

# 2. Get current user
curl -s -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq

# 3. List users
curl -s -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer $TOKEN" | jq

# 4. List roles
curl -s -X GET http://localhost:5000/api/admin/roles \
  -H "Authorization: Bearer $TOKEN" | jq

# 5. Get audit logs
curl -s -X GET http://localhost:5000/api/admin/audit-logs \
  -H "Authorization: Bearer $TOKEN" | jq

# 6. Get Zoho apps
curl -s -X GET http://localhost:5000/api/zoho/my-apps \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Scenario 2: HR User Limited Access

```bash
# 1. Login as HR user
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@company.com","password":"Hr@12345"}' \
  | jq -r '.token')

# 2. Get Zoho apps (should return only Zoho People)
curl -s -X GET http://localhost:5000/api/zoho/my-apps \
  -H "Authorization: Bearer $TOKEN" | jq

# 3. Try to access admin endpoint (should fail with 403)
curl -s -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Scenario 3: Authentication Errors

```bash
# 1. Login with wrong password
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"WrongPassword"}' | jq

# 2. Access endpoint without token
curl -s -X GET http://localhost:5000/api/auth/me | jq

# 3. Access endpoint with invalid token
curl -s -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid_token_xyz" | jq

# 4. Access admin endpoint as non-admin
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@company.com","password":"Hr@12345"}' \
  | jq -r '.token')

curl -s -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 📊 Expected HTTP Status Codes

| Endpoint                     | Method | Success | Failure            |
| ---------------------------- | ------ | ------- | ------------------ |
| `/api/auth/login`            | POST   | 200     | 400, 401           |
| `/api/auth/me`               | GET    | 200     | 401                |
| `/api/admin/users`           | GET    | 200     | 401, 403           |
| `/api/admin/users`           | POST   | 201     | 400, 401, 403, 409 |
| `/api/admin/users/:id/roles` | PATCH  | 200     | 400, 401, 403, 404 |
| `/api/admin/roles`           | GET    | 200     | 401, 403           |
| `/api/admin/audit-logs`      | GET    | 200     | 401, 403           |
| `/api/zoho/my-apps`          | GET    | 200     | 401                |
| `/api/zoho/proxy/:role/*`    | ANY    | 200     | 401, 403           |

---

## 🔐 Security Validation Tests

- [ ] JWT token cannot access endpoints without Authorization header
- [ ] Expired token returns 401 (after 8 hours)
- [ ] Invalid token signature returns 401
- [ ] Non-admin cannot access /admin/\* endpoints (403)
- [ ] Non-admin cannot proxy to unauthorized roles (403)
- [ ] Password hashing verified (different salts)
- [ ] Audit log captures all actions
- [ ] CORS headers prevent cross-origin requests (if configured)

---

## 📝 Notes

- Replace `your_jwt_token_here` with actual token from login response
- Use `jq` for pretty JSON output (install: `brew install jq` on macOS)
- All dates are in ISO 8601 format
- Pagination uses limit/offset parameters
- Audit logs are sorted by most recent first

---

**Happy testing! 🚀**
