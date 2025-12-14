# SatyaScan ML Model Integration

## 🤖 ML Model Setup

This application uses a custom Keras model for product authenticity detection.

### Python Dependencies

Install Python dependencies for ML inference:

```bash
cd backend
pip install -r requirements.txt
```

Required packages:
- `tensorflow-cpu` - ML model runtime
- `pillow` - Image processing
- `numpy` - Numerical operations

### Model File

The Keras model file (`cosmetic_fake_real_model.keras`) should be placed in the `backend/` directory.

##  Architecture

### Backend (Node.js + Python)

1. **Express Server** (`server.js`) - Main API server
2. **ML Route** (`routes/ml.js`) - Handles image uploads and ML predictions
3. **Python Script** (`predict.py`) - Runs ML model inference

**Flow:**
```
Frontend → Upload Image → Express (multer) → Python Script → Keras Model → JSON Response → Frontend
```

### Frontend (React + TypeScript)

- **Scanner Component** - Uses `mlService.ts` for ML-based analysis
- **ChatBot Component** - Uses `geminiService.ts` for Gemini API (LUCI)

## 🔌 API Endpoints

### ML Analysis
```
POST /api/ml/analyze
Content-Type: multipart/form-data

Body: image (file)

Response:
{
  "status": "AUTHENTIC" | "SUSPICIOUS" | "FAKE",
  "confidenceScore": 95,
  "reasoning": ["..."],
  "productName": "Cosmetic Product",
  "brand": "ML Analysis",
  "extractedText": ["..."],
  "mlProbability": 0.05
}
```

### ML Status Check
```
GET /api/ml/ml-status

Response:
{
  "modelExists": true,
  "scriptExists": true,
  "ready": true
}
```

## 🧪 Testing

### Test Python Script Directly
```bash
cd backend
python predict.py path/to/test/image.jpg
```

### Test Backend API
```bash
curl -F "image=@test.jpg" http://localhost:5000/api/ml/analyze
```

### Test Frontend
1. Start both servers: `npm start` (from root)
2. Navigate to http://localhost:3000
3. Click "NEW SCAN" or "START SCAN"
4. Upload a cosmetic product image
5. View the ML analysis results

## 📝 Notes

- **Scanning**: Uses custom ML model (Python/TensorFlow)
- **Chatbot (LUCI)**: Uses Gemini API (requires `GEMINI_API_KEY` in frontend `.env.local`)
- **Image Processing**: Images are temporarily saved to `backend/uploads/` and deleted after analysis
- **Model Input**: Images are resized to 224x224 and normalized to [0, 1]
- **Prediction**: Binary classification (Real/Fake) with probability score

## 🔧 Troubleshooting

### Python not found
Install Python 3.8+ from https://www.python.org/downloads/

### TensorFlow installation fails
Try installing individually:
```bash
pip install tensorflow-cpu
pip install pillow numpy
```

### Model file not found
Ensure `cosmetic_fake_real_model.keras` is in the `backend/` directory.

### Analysis fails
Check backend logs for Python errors. The Node.js server logs Python stdout/stderr.
