@echo off
echo ===============================================
echo  SatyaScan - Testing ML Model Integration
echo ===============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

echo [1/3] Python found: 
python --version
echo.

REM Check if dependencies are installed
echo [2/3] Checking Python dependencies...
python -c "import tensorflow; import PIL; import numpy" >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Python dependencies not installed
    echo Installing dependencies...
    cd backend
    pip install -r requirements.txt
    cd ..
)
echo Dependencies OK
echo.

REM Check if model exists
echo [3/3] Checking ML model...
if not exist "backend\cosmetic_fake_real_model.keras" (
    echo ERROR: Model file not found!
    echo Expected location: backend\cosmetic_fake_real_model.keras
    pause
    exit /b 1
)
echo Model file found
echo.

echo ===============================================
echo  All checks passed! ML integration is ready.
echo ===============================================
echo.
echo You can now run: npm start
echo.
pause
