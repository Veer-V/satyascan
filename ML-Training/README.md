# ML Training Setup - IMPORTANT

## ⚠️ Python Version Issue

**Problem**: Python 3.13 is NOT compatible with TensorFlow 2.17.x  
**Solution**: Install Python 3.11 or 3.10

### Option 1: Install Compatible Python (Recommended)

1. Download Python 3.11: https://www.python.org/downloads/release/python-31110/
2. Install it (check "Add to PATH")
3. Install dependencies:
```bash
cd ML-Training
pip install tensorflow pillow numpy
```

### Option 2: Use Virtual Environment

```bash
# If you have Python 3.11 installed
python3.11 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## Quick Test

Run from ML-Training folder:
```bash
test_setup.bat
```

This will check:
- ✓ Python version
- ✓ Dependencies (PIL, NumPy, TensorFlow)
- ✓ Model file exists
- ✓ ML service script works

## Files in This Folder

- **cosmetic_fake_real_model.keras** - Your trained model (21 MB)
- **ml_service.py** - Main inference script (improved with error handling)
- **predict.py** - Legacy script (backup)
- **requirements.txt** - Python dependencies
- **test_setup.bat** - Setup verification script
- **README.md** - This file

## Current Status

✅ Folder structure created  
✅ Model file copied  
✅ ML service script ready  
✅ Backend routes updated  
❌ TensorFlow import failing (Python 3.13 incompatibility)

## Temporary Workaround

The backend will gracefully handle Python errors and return a helpful message if TensorFlow isn't available. The app will still run, but ML predictions won't work until Python 3.11/3.10 is installed.

## After Fixing Python

1. Verify setup: `test_setup.bat`
2. Test inference: `python ml_service.py path/to/image.jpg`
3. Restart backend: `npm start` from project root
4. Test scanning in the UI
