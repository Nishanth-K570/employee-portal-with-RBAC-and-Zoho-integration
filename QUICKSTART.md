# 🚀 Quick Start Guide

Get the Employee Portal running in 5 minutes!

## Prerequisites

Ensure you have installed:

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **PostgreSQL** ([Download](https://www.postgresql.org/download/))
- **Git** (optional, for version control)

## Step 1: Verify Setup (2 minutes)

### On Windows:

```bash
verify-setup.bat
```

### On macOS/Linux:

```bash
chmod +x verify-setup.sh
./verify-setup.sh
```

This checks that all dependencies are installed.

## Step 2: Install Dependencies (1 minute)

### Backend:

```bash
cd backend
npm install
```

### Frontend:

```bash
cd frontend
npm install
```

## Step 3: Configure Environment (1 minute)

### Backend Configuration

Edit `backend/.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_portal
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=8h

# Server Configuration
PORT=5000

# Zoho OAuth Configuration (Get from Zoho API console)
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_ACCOUNTS_URL=https://accounts.zoho.in
```

### Frontend Configuration

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 4: Setup Database (1 minute)

### Create PostgreSQL Database:

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql prompt, run:
CREATE DATABASE employee_portal;
\q
```

### Seed Demo Data:

```bash
cd backend
npm run seed
```

You should see output like:

```
✓ Roles created successfully
✓ Permissions created successfully
✓ Admin user created
✓ HR user created
✓ Database synced successfully
```

## Step 5: Start the Application (1 minute)

### Terminal 1 - Backend:

```bash
cd backend
npm run dev
```

You should see:

```
✓ Database synced
✓ Server listening on http://localhost:5000
```

### Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

You should see:

```
✓ VITE v5.4.6 ready in 234 ms
➜  Local:   http://localhost:5173/
```

## 🎉 You're Ready!

Open your browser to: **http://localhost:5173**

### Demo Credentials

**Admin User:**

```
Email: admin@company.com
Password: Admin@123
```

**HR User:**

```
Email: hr@company.com
Password: Hr@12345
```

### What to Try

1. **Login**: Use admin credentials
2. **View Dashboard**: See all 4 Zoho apps
3. **Logout & Login as HR**: See only Zoho People
4. **Admin Panel**: Click "Admin Access" to manage users
5. **Add User**: Create a new user with specific roles
6. **Change Role**: Update user roles using the dropdown
7. **View Audit Logs**: See all system activities

## 📊 Useful Commands

### Backend Commands

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Seed database with demo data
npm run seed

# Reset database (run migrations)
npm run db:sync
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm build

# Preview production build
npm run preview
```

## 🔍 API Testing

### Test Backend Health:

```bash
curl http://localhost:5000/health
```

### Test Login Endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "Admin@123"
  }'
```

You'll get a response like:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@company.com",
    "roles": ["Admin"],
    "permissions": [...]
  }
}
```

### Test Protected Endpoint:

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🆘 Troubleshooting

### "Cannot find module..."

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432

Solutions:
1. Check PostgreSQL is running: sudo service postgresql status
2. Verify DB credentials in .env file
3. Make sure database exists: createdb employee_portal
```

### Port Already in Use

```bash
# Backend port 5000 in use:
# Kill process or change PORT in .env

# Frontend port 5173 in use:
# Vite will auto-increment to 5174, etc.
```

### CORS Errors

```
Access to XMLHttpRequest blocked by CORS policy

Solutions:
1. Verify VITE_API_URL in frontend/.env
2. Ensure backend CORS is enabled
3. Check backend is running on port 5000
```

### JWT Token Errors

```
Error: Invalid token

Solutions:
1. Clear browser localStorage
2. Re-login to get new token
3. Check JWT_SECRET is set in backend/.env
4. Verify token hasn't expired (8 hour expiry)
```

## 📚 Full Documentation

For detailed information, see:

- [README_COMPLETE.md](README_COMPLETE.md) - Full project documentation
- [VIDEO_GUIDE.md](VIDEO_GUIDE.md) - Video recording guide

## 🎓 Learning Path

New to the codebase? Start here:

1. **Authentication** → `backend/middlewares/auth.js`
2. **RBAC** → `backend/middlewares/rbac.js`
3. **Models** → `backend/models/index.js`
4. **Routes** → `backend/routes/`
5. **Frontend Context** → `frontend/src/context/AuthContext.jsx`
6. **Frontend Pages** → `frontend/src/pages/`

## 🚀 Production Deployment

### Backend (Node.js)

```bash
# Build
npm install --production

# Run
NODE_ENV=production npm start
```

### Frontend (Static Build)

```bash
# Build
npm run build

# Output: dist/ folder with static files
# Deploy to: Nginx, Apache, Vercel, Netlify, etc.
```

## 📞 Support

For issues:

1. Check Troubleshooting section above
2. Review [README_COMPLETE.md](README_COMPLETE.md)
3. Check console for error messages
4. Verify all prerequisites are installed

---

**Enjoy your Employee Portal! 🎉**
