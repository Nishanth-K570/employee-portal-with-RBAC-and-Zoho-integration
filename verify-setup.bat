@echo off
REM Employee Portal Setup Verification Script (Windows)
REM This script verifies all required components are installed and configured

setlocal enabledelayedexpansion

echo ===============================================
echo Employee Portal Setup Verification (Windows)
echo ===============================================
echo.

set ISSUES=0

REM Function to check if command exists
:check_command
where %~1 >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] %~1 is installed
) else (
    echo [ERROR] %~1 is NOT installed
    set /a ISSUES+=1
)
exit /b

REM Check Node.js
echo 1. Checking System Requirements...
echo -----------------------------------
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Node.js is installed
    node --version
) else (
    echo [ERROR] Node.js is NOT installed
    set /a ISSUES+=1
)

where npm >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] npm is installed
    npm --version
) else (
    echo [ERROR] npm is NOT installed
    set /a ISSUES+=1
)

where git >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Git is installed
) else (
    echo [ERROR] Git is NOT installed
    set /a ISSUES+=1
)

echo.
echo 2. Checking Backend Setup...
echo -----------------------------------
if exist "backend\package.json" (
    echo [OK] backend\package.json exists
) else (
    echo [ERROR] backend\package.json does NOT exist
    set /a ISSUES+=1
)

if exist "backend\.env" (
    echo [OK] backend\.env exists
) else (
    echo [ERROR] backend\.env does NOT exist
    set /a ISSUES+=1
)

if exist "backend\node_modules" (
    echo [OK] Backend dependencies installed
) else (
    echo [WARNING] Backend dependencies NOT installed
    echo Run: cd backend ^&^& npm install
    set /a ISSUES+=1
)

echo.
echo 3. Checking Frontend Setup...
echo -----------------------------------
if exist "frontend\package.json" (
    echo [OK] frontend\package.json exists
) else (
    echo [ERROR] frontend\package.json does NOT exist
    set /a ISSUES+=1
)

if exist "frontend\.env" (
    echo [OK] frontend\.env exists
) else (
    echo [ERROR] frontend\.env does NOT exist
    set /a ISSUES+=1
)

if exist "frontend\node_modules" (
    echo [OK] Frontend dependencies installed
) else (
    echo [WARNING] Frontend dependencies NOT installed
    echo Run: cd frontend ^&^& npm install
    set /a ISSUES+=1
)

echo.
echo 4. Summary
echo -----------------------------------
if %ISSUES% equ 0 (
    echo.
    echo [SUCCESS] All checks passed! Your setup is ready.
    echo.
    echo To start development:
    echo   Terminal 1: cd backend ^&^& npm run dev
    echo   Terminal 2: cd frontend ^&^& npm run dev
    echo.
    echo Then open: http://localhost:5173
) else (
    echo.
    echo [WARNING] There are %ISSUES% issue(s) to resolve.
    echo.
    echo Common fixes:
    echo   1. Install Node.js from https://nodejs.org/
    echo   2. Install PostgreSQL from https://www.postgresql.org/
    echo   3. Run: cd backend ^&^& npm install
    echo   4. Run: cd frontend ^&^& npm install
    echo   5. Create database: createdb employee_portal
    echo   6. Seed database: cd backend ^&^& npm run seed
)

echo.
pause
