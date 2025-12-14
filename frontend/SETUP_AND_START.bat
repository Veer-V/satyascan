@echo off
echo ========================================
echo   MongoDB Atlas IP Whitelist Guide
echo ========================================
echo.
echo STEP 1: The browser window has opened MongoDB Atlas
echo         (If not, open: https://cloud.mongodb.com)
echo.
echo STEP 2: Log in with your credentials
echo.
echo STEP 3: After logging in:
echo         1. Click "Network Access" (left sidebar)
echo         2. Click green "ADD IP ADDRESS" button
echo         3. Click "ADD CURRENT IP ADDRESS"
echo         4. Click "Confirm"
echo.
echo STEP 4: Wait 2-3 minutes for changes to take effect
echo.
echo STEP 5: Press any key HERE to start the backend server...
pause

echo.
echo Starting backend server...
cd server
npm start

pause
