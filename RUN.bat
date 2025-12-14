@echo off
echo ================================================
echo    SatyaScan - Full Stack Application
echo ================================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Starting both servers...
echo Press Ctrl+C to stop
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo Close this window or press any key to continue...
pause >nul
