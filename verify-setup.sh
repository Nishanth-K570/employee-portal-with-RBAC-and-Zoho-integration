#!/bin/bash

# Employee Portal Setup Verification Script
# This script verifies all required components are installed and configured

echo "==============================================="
echo "Employee Portal Setup Verification"
echo "==============================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track issues
ISSUES=0

# Function to check if command exists
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        ((ISSUES++))
        return 1
    fi
}

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 does NOT exist"
        ((ISSUES++))
        return 1
    fi
}

echo "1. Checking System Requirements..."
echo "-----------------------------------"
check_command "node"
check_command "npm"
check_command "git"
check_command "psql"

echo ""
echo "2. Checking Backend Setup..."
echo "-----------------------------------"
check_file "backend/package.json"
check_file "backend/.env"
check_file "backend/server.js"

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies NOT installed (run: cd backend && npm install)"
    ((ISSUES++))
fi

echo ""
echo "3. Checking Frontend Setup..."
echo "-----------------------------------"
check_file "frontend/package.json"
check_file "frontend/.env"
check_file "frontend/src/main.jsx"

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies NOT installed (run: cd frontend && npm install)"
    ((ISSUES++))
fi

echo ""
echo "4. Checking Environment Configuration..."
echo "-----------------------------------"

# Check backend .env
if grep -q "ZOHO_CLIENT_ID" backend/.env && [ -z "$(grep '^ZOHO_CLIENT_ID=$' backend/.env)" ]; then
    echo -e "${GREEN}✓${NC} ZOHO_CLIENT_ID configured"
else
    echo -e "${YELLOW}⚠${NC} ZOHO_CLIENT_ID not configured in backend/.env"
    ((ISSUES++))
fi

if grep -q "JWT_SECRET" backend/.env && [ -z "$(grep '^JWT_SECRET=$' backend/.env)" ]; then
    echo -e "${GREEN}✓${NC} JWT_SECRET configured"
else
    echo -e "${YELLOW}⚠${NC} JWT_SECRET not configured in backend/.env"
    ((ISSUES++))
fi

# Check frontend .env
if grep -q "VITE_API_URL" frontend/.env; then
    echo -e "${GREEN}✓${NC} VITE_API_URL configured"
else
    echo -e "${YELLOW}⚠${NC} VITE_API_URL not configured in frontend/.env"
    ((ISSUES++))
fi

echo ""
echo "5. Checking Database..."
echo "-----------------------------------"

# Try to connect to PostgreSQL
if psql -U postgres -d employee_portal -c "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✓${NC} PostgreSQL database 'employee_portal' exists"
else
    echo -e "${YELLOW}⚠${NC} PostgreSQL database 'employee_portal' not found"
    echo "   Create it with: createdb employee_portal"
    echo "   Then seed it with: cd backend && npm run seed"
    ((ISSUES++))
fi

echo ""
echo "6. Summary"
echo "-----------------------------------"
if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Your setup is ready.${NC}"
    echo ""
    echo "To start development:"
    echo "  Terminal 1: cd backend && npm run dev"
    echo "  Terminal 2: cd frontend && npm run dev"
    echo ""
    echo "Then open: http://localhost:5173"
else
    echo -e "${YELLOW}⚠ There are $ISSUES issue(s) to resolve.${NC}"
    echo ""
    echo "Common fixes:"
    echo "  1. Install Node.js from https://nodejs.org/"
    echo "  2. Install PostgreSQL"
    echo "  3. Run: cd backend && npm install"
    echo "  4. Run: cd frontend && npm install"
    echo "  5. Run: createdb employee_portal"
    echo "  6. Run: cd backend && npm run seed"
fi

echo ""
