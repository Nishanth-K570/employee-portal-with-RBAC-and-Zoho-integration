# 🎬 Video Recording & Presentation Guide

This guide will help you create a comprehensive 3-5 minute video demonstration of the Employee Portal project.

## 📋 Video Structure (Suggested Timeline)

### Section 1: Project Overview (30 seconds)

**Goal**: Introduce the project and its purpose

**Talking Points:**

- "This is a custom Employee Portal with Zoho One integration"
- "It provides role-based access control so employees can access only permitted Zoho applications"
- "Employees use portal credentials only - no individual Zoho accounts needed"
- "All Zoho API access is managed by a secure backend service account"

**Visual Demo:**

- Show the login page
- Explain the three demo roles: Admin, HR, Finance

---

### Section 2: Login & Dashboard Demo (1 minute)

**Goal**: Show the authentication flow and role-based access

**Sequence:**

#### 2a. Admin User Login (30 seconds)

```
1. Open http://localhost:5173 in browser
2. Enter: admin@company.com / Admin@123
3. Click "Sign In"
4. Show loading spinner, then redirect to dashboard
```

**Talking Points:**

- "The login uses JWT authentication with password hashing"
- "After login, the user receives a JWT token stored in browser"
- "All subsequent API requests include this token for authorization"

#### 2b. Admin Dashboard (15 seconds)

```
1. Point out the user info: name, email, roles, and permissions
2. Show "Your Applications" section with 4 Zoho apps visible:
   - Zoho People (HR role)
   - Zoho CRM (Sales role)
   - Zoho Desk (Support role)
   - Zoho Books (Finance role)
3. Explain: Admin role has access to ALL Zoho apps
```

**Talking Points:**

- "The dashboard conditionally renders Zoho app buttons based on the user's roles"
- "The /api/zoho/my-apps endpoint returns only the apps this user is authorized for"
- "This happens via backend RBAC middleware that checks the JWT token"

#### 2c. Logout & Login as HR User (15 seconds)

```
1. Click "Logout" button
2. Log in as: hr@company.com / Hr@12345
3. Show the dashboard again
```

**Talking Points:**

- "Now as an HR user, notice only Zoho People is visible"
- "This is because the HR role only has permission for Zoho People"
- "The RBAC middleware on the backend enforces this permission check"

---

### Section 3: Admin Panel Features (1 minute)

**Goal**: Demonstrate admin capabilities

**Sequence:**

#### 3a. Logout & Login as Admin

```
1. Logout
2. Login as admin@company.com / Admin@123
3. Scroll down to "Admin Access" section
4. Click "Go to Admin Panel"
```

#### 3b. Users Tab (20 seconds)

```
1. Show the Users Management table
2. Display user list: name, email, roles
3. Click "+ Add New User" button
4. Show the form fields:
   - Name
   - Email
   - Password
   - Role checkboxes (Admin, HR, Sales, Support, Finance)
5. Close the form
6. Click the "Change role" dropdown for a user
7. Show how you can update user roles
```

**Talking Points:**

- "Admins can create new users with specific roles"
- "Users can be assigned multiple roles"
- "Each role maps to specific Zoho applications and permissions"

#### 3c. Roles Tab (20 seconds)

```
1. Click the "Roles" tab
2. Show role cards displaying:
   - Role name (Admin, HR, Sales, etc.)
   - Permissions list (zoho:people:access, etc.)
3. Explain the permission structure
```

**Talking Points:**

- "The system uses fine-grained permission management"
- "Each Zoho application is gated behind a specific permission"
- "When a user is assigned a role, they inherit all that role's permissions"

#### 3d. Audit Logs Tab (20 seconds)

```
1. Click the "Audit Logs" tab
2. Show the table with columns: Action, Details, IP Address, Timestamp
3. Point out entries like:
   - LOGIN_SUCCESS
   - USER_CREATED
   - USER_ROLES_UPDATED
   - ZOHO_PROXY_REQUEST
4. Scroll through to show the audit trail
```

**Talking Points:**

- "Every action in the system is logged for compliance"
- "We track: logins, user creation, role changes, Zoho access attempts"
- "Logs include timestamp and IP address for security"

---

### Section 4: RBAC Implementation Deep Dive (1 minute)

**Goal**: Explain how RBAC works

**Code Walkthrough:**

#### 4a. Show the RBAC Middleware

```
Open: backend/middlewares/rbac.js
```

**Code to Highlight:**

```javascript
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = req.auth?.roles || [];
    const hasRole = userRoles.some((r) => allowedRoles.includes(r));
    if (!hasRole) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
}
```

**Talking Points:**

- "This middleware checks if the user has any of the allowed roles"
- "It returns 403 Forbidden if the user lacks required role"
- "This runs on EVERY protected endpoint"

#### 4b. Show How Routes Use RBAC

```
Open: backend/routes/adminRoutes.js
```

**Code to Highlight:**

```javascript
router.use(authenticate, requireRole("Admin"));
router.get("/users", admin.listUsers);
```

**Talking Points:**

- "First, authenticate middleware verifies the JWT token"
- "Then, requireRole middleware ensures user is Admin"
- "Only then does the route handler execute"

#### 4c. Show Authentication Middleware

```
Open: backend/middlewares/auth.js
```

**Talking Points:**

- "The authenticate middleware verifies JWT signature"
- "It decodes the token and attaches user info to req.auth"
- "If token is invalid/expired, it returns 401 Unauthorized"

---

### Section 5: Zoho API Integration (1 minute)

**Goal**: Explain the Zoho OAuth security architecture

**Sequence:**

#### 5a. Show the Service Account Model

```
Open: backend/services/zohoService.js
```

**Code to Highlight:**

```javascript
async function getServiceAccountAccessToken() {
  const response = await axios.post(
    `${ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
    null,
    {
      params: {
        refresh_token: ZOHO_REFRESH_TOKEN,
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token",
      },
    },
  );
  cachedToken = response.data.access_token;
  return cachedToken;
}
```

**Talking Points:**

- "The backend has ONE service account for Zoho"
- "This is configured with ZOHO_CLIENT_ID, CLIENT_SECRET, and REFRESH_TOKEN"
- "Employees' browsers NEVER see these credentials"
- "The refresh token allows automatic token renewal without human intervention"

#### 5b. Show Role-to-App Mapping

```
Still in backend/services/zohoService.js
```

**Code to Highlight:**

```javascript
const ROLE_ZOHO_MAP = {
  HR: { app: "Zoho People", apiBase: "/people/api" },
  Sales: { app: "Zoho CRM", apiBase: "/crm/v3" },
  Support: { app: "Zoho Desk", apiBase: "/desk/v1" },
  Finance: { app: "Zoho Books", apiBase: "/books/v3" },
};
```

**Talking Points:**

- "Each portal role maps to exactly ONE Zoho application"
- "When a user requests /api/zoho/my-apps, we filter using this mapping"
- "The backend returns only the apps their roles allow"

#### 5c. Show the Proxy Endpoint

```
Open: backend/controllers/zohoController.js
```

**Code to Highlight:**

```javascript
async function proxy(req, res) {
  const { role } = req.params;
  const userRoles = req.auth.roles || [];

  if (!userRoles.includes(role) && !userRoles.includes("Admin")) {
    return res
      .status(403)
      .json({ error: `Not authorized for ${role} Zoho services` });
  }

  const data = await proxyToZoho(role, subPath, req.method, req.body);
  res.json(data);
}
```

**Talking Points:**

- "The proxy endpoint validates user has the requested role"
- "Then it retrieves a fresh Zoho access token (cached)"
- "It forwards the user's request to the correct Zoho service"
- "The employee never sees a Zoho token - complete security"

#### 5d. Show the Flow Diagram

```
Draw/show on whiteboard or with slides:

User Browser
    ↓
POST /api/zoho/proxy/HR/*
Header: Authorization: Bearer JWT_TOKEN
    ↓
Backend (authenticate middleware)
    ↓
Backend (check role = HR)
    ↓
Get Zoho Access Token (cached)
    ↓
Forward to Zoho APIs
    ↓
Response back to User
(User never sees Zoho token)
```

---

### Section 6: Database & Data Flow (30 seconds)

**Goal**: Explain data persistence and audit logging

**Sequence:**

#### 6a. Show Database Schema

```
Open: backend/models/index.js
```

**Talking Points:**

- "Users table: stores username, email, password hash"
- "Roles table: Admin, HR, Sales, Support, Finance"
- "Permissions table: zoho:people:access, zoho:crm:access, etc."
- "UserRole and RolePermission: join tables for many-to-many relationships"
- "AuditLogs: every action is recorded with timestamp and IP"

#### 6b. Show Seeded Data

```
Run: npm run seed (in backend)
Show output confirming:
- Roles created
- Permissions created
- Demo users created
```

**Talking Points:**

- "The seed script initializes the database"
- "It creates the standard roles and permissions"
- "It creates demo users for testing"

---

### Section 7: Frontend React Components (30 seconds)

**Goal**: Briefly show component structure

**Sequence:**

#### 7a. Show Component Hierarchy

```
Open: frontend/src/App.jsx
```

**Talking Points:**

- "Top-level App component sets up routes"
- "AuthProvider wraps the entire app for authentication state"
- "ProtectedRoute component ensures only authenticated users can access pages"

#### 7b. Show a Component

```
Open: frontend/src/components/Navbar.jsx
```

**Talking Points:**

- "The Navbar displays user info, roles, and logout button"
- "Uses Tailwind CSS for responsive design"
- "Mobile-friendly breakpoints included"

---

## 📹 Recording Tips

### Technical Setup

1. **Screen Resolution**: Record at 1080p or higher
2. **Audio**: Use a decent microphone (built-in is okay)
3. **Background**: Quiet environment without distractions
4. **Tools**:
   - Zoom (free tier supports 45-minute meetings)
   - OBS Studio (free, open-source)
   - Loom (free tier - 5 minute/video limit)
   - ScreenFlow (macOS)
   - ShareX (Windows)

### Recording Tips

1. **Start the servers first**:

   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev

   # Terminal 2: Frontend
   cd frontend && npm run dev

   # Wait for both to be ready
   ```

2. **Open three browser tabs**:
   - Tab 1: Frontend (http://localhost:5173)
   - Tab 2: Backend code (VS Code)
   - Tab 3: Postman (for API testing - optional)

3. **Script your narration** to stay on time

4. **Do a test run** first

5. **Speak clearly and slowly** - viewers may pause to understand

6. **Pause between sections** to let viewers catch up

### Narration Script Template

---

#### **[0:00-0:30] Introduction**

```
"Hello everyone. Today I'm demonstrating a custom Employee Portal
with Zoho One integration. This is a full-stack web application
that provides role-based access control so employees can securely
access only the Zoho applications permitted by their job role.

The key innovation here is that all Zoho API access is managed
by a single backend service account, so no employee ever needs
individual Zoho credentials. Let me show you how it works."
```

#### **[0:30-1:30] Login & Dashboard**

```
"Let me start by logging in. I'm using the demo admin credentials.
After authentication, I'm redirected to the dashboard.

Notice that as an Admin, I have access to all four Zoho applications:
People for HR, CRM for Sales, Desk for Support, and Books for Finance.

Now let me logout and login as an HR employee to show role-based access.
With the HR role, the dashboard now shows only Zoho People, which is
the application designated for HR staff. This is enforced on both the
frontend via conditional rendering and on the backend via RBAC middleware."
```

#### **[1:30-2:30] Admin Panel**

```
"As an Admin, I have access to the Admin Panel where I can:

First, manage users. Here I can see all portal users, their assigned roles,
and I can change their roles with this dropdown.

I can also create new users by clicking 'Add New User' and filling in
their details along with the roles they should have.

The Roles tab shows the permission structure. Each role has specific
permissions - for example, the HR role has 'zoho:people:access',
while the Finance role has 'zoho:books:access'.

Finally, the Audit Logs tab shows every action in the system - successful
logins, failed logins, user creations, role changes, and even access
attempts to Zoho services. Each log entry includes a timestamp and
IP address for compliance tracking."
```

#### **[2:30-3:30] RBAC Implementation**

```
"Let me show you how the RBAC is implemented. Opening the middleware code...

This requireRole middleware checks if the user has any of the allowed roles.
If not, it returns a 403 Forbidden error.

In the routes, we apply this middleware like this: every admin endpoint
first verifies the JWT token, then checks the user has the Admin role,
and only then executes the route handler.

The authentication middleware verifies the JWT signature and extracts
user information. If the token is invalid or expired, it returns 401 Unauthorized.

This multi-layer approach ensures that even if someone manages to get a
JWT token, they can't access endpoints they're not authorized for."
```

#### **[3:30-4:30] Zoho Integration**

```
"Now for the Zoho integration, which is the security core of this system.

The backend has ONE service account configured with Zoho credentials:
Client ID, Client Secret, and a Refresh Token. These credentials are
stored in environment variables on the backend server only.

When the frontend requests to access a Zoho service, the backend:
1. Verifies the user's JWT token
2. Checks if their role has access to that Zoho app
3. Retrieves a fresh Zoho access token (with caching for efficiency)
4. Proxies the request to Zoho
5. Returns the response to the frontend

At no point does the frontend ever see a Zoho token or credential.
The employee only authenticates with the portal - Zoho authentication
is handled completely by the backend service account.

This mapping shows how portal roles map to Zoho applications. Each role
gets exactly one primary Zoho app. When a user asks for /api/zoho/my-apps,
we return only the apps their roles allow."
```

#### **[4:30-5:00] Conclusion**

```
"To summarize:
- Employees login with portal credentials (JWT auth)
- Backend verifies permissions via RBAC middleware
- Dashboard shows only authorized Zoho apps
- Admin can manage users, roles, and permissions
- All Zoho access goes through a single backend service account
- Complete audit trail of all system activity

The code is well-structured, secure, and production-ready.
Thank you for watching!"
```

---

## 📊 Recording Checklist

- [ ] Backend server is running (`npm run dev`)
- [ ] Frontend server is running (`npm run dev`)
- [ ] Screen recording software is open
- [ ] Audio input is working
- [ ] Resolution is set to 1080p+
- [ ] You've tested the audio/video
- [ ] Demo credentials are ready
- [ ] Code files are open in editor
- [ ] You have your script printed/noted
- [ ] Recording light is on
- [ ] Recorded video in high quality format
- [ ] Tested video plays correctly
- [ ] Uploaded to submission platform

---

## 🎯 Common Mistakes to Avoid

1. **Going Too Fast**: Viewers can't keep up with the screen navigation
2. **Not Showing Code**: Visual learners need to see actual implementation
3. **Weak Audio**: Invest in a decent microphone
4. **Poor Lighting**: If you include webcam, ensure good lighting
5. **No Pauses**: Leave silence between sections so viewers can absorb
6. **Too Long**: Keep it to 3-5 minutes max
7. **Mumbling**: Speak clearly and enunciate
8. **Showing Errors**: Make sure the app works before recording

---

## 📤 Video Submission Tips

- **Format**: MP4 (H.264 codec, AAC audio)
- **Bitrate**: 5-10 Mbps for quality
- **Size**: Aim for under 200MB for easy sharing
- **Platform**: Upload to YouTube (private), Vimeo, or Loom
- **Get Shareable Link**: Make sure reviewer can access it
- **Backup**: Keep local copy and cloud backup

---

**Good luck with your recording! 🎬**
