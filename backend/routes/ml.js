import express from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// ML Analysis endpoint
router.post('/analyze', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const imagePath = req.file.path;
  const pythonScript = path.join(__dirname, '../../ML-Training/ml_service.py');

  console.log(`🔍 Analyzing image: ${imagePath}`);

  try {
    // Call Python script for ML prediction
    const python = spawn('python', [pythonScript, imagePath]);

    let dataString = '';
    let errorString = '';

    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorString += data.toString();
      console.error(`Python stderr: ${data}`);
    });

    python.on('close', (code) => {
      // Clean up uploaded file
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });

      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        console.error(`Error output: ${errorString}`);
        return res.status(500).json({
          error: 'ML analysis failed',
          details: errorString
        });
      }

      try {
        const result = JSON.parse(dataString);
        console.log(`✅ Analysis complete: ${result.status} (${result.confidenceScore}%)`);
        res.json(result);
      } catch (parseError) {
        console.error('Error parsing Python output:', parseError);
        console.error('Raw output:', dataString);
        res.status(500).json({
          error: 'Failed to parse analysis results',
          details: parseError.message
        });
      }
    });

  } catch (error) {
    // Clean up file on error
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check for ML service
router.get('/ml-status', (req, res) => {
  const modelPath = path.join(__dirname, '../../ML-Training/cosmetic_fake_real_model.keras');
  const pythonScript = path.join(__dirname, '../../ML-Training/ml_service.py');
  
  const status = {
    modelExists: fs.existsSync(modelPath),
    scriptExists: fs.existsSync(pythonScript),
    ready: fs.existsSync(modelPath) && fs.existsSync(pythonScript)
  };
  
  res.json(status);
});

export default router;
