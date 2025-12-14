import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabase.js';
import scansRouter from './routes/scans.js';
import mlRouter from './routes/ml.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/scans', scansRouter);
app.use('/api/ml', mlRouter);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test Supabase connection by querying scan_history table
    const { error } = await supabase
      .from('scan_history')
      .select('id', { count: 'exact', head: true });
    
    res.json({ 
      status: 'OK', 
      message: 'SatyaScan API Server is running',
      timestamp: new Date().toISOString(),
      database: {
        connected: !error,
        type: 'Supabase (REST API)',
        error: error ? error.message : null
      }
    });
  } catch (err) {
    res.json({ 
      status: 'OK', 
      message: 'SatyaScan API Server is running',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        type: 'Supabase (REST API)',
        error: err.message
      }
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'SatyaScan Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      scans: '/api/scans',
      stats: '/api/scans/stats/summary'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`\n📌 Available endpoints:`);
  console.log(`   GET  /api/health - Health check`);
  console.log(`   GET  /api/scans - Get all scans`);
  console.log(`   POST /api/scans - Save new scan`);
  console.log(`   GET  /api/scans/:id - Get scan by ID`);
  console.log(`   DELETE /api/scans/:id - Delete scan`);
  console.log(`   GET  /api/scans/stats/summary - Get statistics\n`);
});

export default app;
