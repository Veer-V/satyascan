@echo off
echo ================================================
echo  SatyaScan ML Setup - Checking Installation
echo ================================================
echo.

REM Check Python version
python --version
echo.

echo [1/4] Checking Python dependencies...
echo.

python -c "import sys; print('Python version:', sys.version_info[:2])"

echo.
echo [2/4] Testing imports...
echo.

python -c "import PIL; print('✓ Pillow OK')" 2>&1
python -c "import numpy; print('✓ NumPy OK')" 2>&1  
python -c "import tensorflow; print('✓ TensorFlow OK')" 2>&1

if %errorlevel% neq 0 (
    echo.
    echo ⚠️  TensorFlow not properly installed!
    echo.
    echo Python 3.13 is not compatible with current TensorFlow versions.
    echo Please install Python 3.11 or 3.10 from: https://www.python.org/downloads/
    echo.
    echo Alternatively, try reinstalling:
    echo   pip uninstall tensorflow tensorflow-cpu tensorflow-intel
    echo   pip install tensorflow
    echo.
    pause
    exit /b 1
)

echo.
echo [3/4] Checking model file...
if not exist "cosmetic_fake_real_model.keras" (
    echo ❌ Model file not found!
    pause
    exit /b 1
)
echo ✓ Model file found

echo.
echo [4/4] Testing ML service...
python ml_service.py 2>&1 | findstr "No image path"
if %errorlevel% equ 0 (
    echo ✓ ML service script OK
) else (
    echo ❌ ML service has issues
    pause
    exit /b 1
)

echo.
echo ================================================
echo  ✅ ML Setup Complete!
echo ================================================
echo.
echo You can now start the application with: npm start
echo.
pause
