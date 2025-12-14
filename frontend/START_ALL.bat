@echo off
echo ========================================
echo   SatyaScan - Starting Both Servers
echo ========================================
echo.
echo This will open TWO terminal windows:
echo   1. Backend Server (Port 5000)
echo   2. Frontend Server (Port 5173)
echo.
echo Press any key to continue...
pause >nul

echo.
echo Starting Backend Server...
start "SatyaScan Backend" cmd /k "cd server && npm start"

timeout /t 2 >nul

echo Starting Frontend Server...
start "SatyaScan Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Check the opened terminal windows for server status.
echo Close this window when done.
pause
