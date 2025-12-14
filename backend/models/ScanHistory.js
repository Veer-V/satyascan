import mongoose from 'mongoose';

const scanHistorySchema = new mongoose.Schema({
  // Unique scan ID
  scanId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Scan date/time
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  // Image thumbnail (base64 or URL)
  thumbnail: {
    type: String,
    required: true
  },
  
  // Analysis result details
  result: {
    productName: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['AUTHENTIC', 'SUSPICIOUS', 'FAKE', 'UNKNOWN'],
      required: true
    },
    confidenceScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    reasoning: [{
      type: String
    }],
    manufacturingDate: String,
    batchCode: String,
    officialWebsite: String,
    reportingUrl: String,
    extractedText: [{
      type: String
    }]
  },
  
  // Optional user ID for future authentication
  userId: {
    type: String,
    default: 'anonymous'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Index for faster queries
scanHistorySchema.index({ date: -1 });
scanHistorySchema.index({ 'result.status': 1 });
scanHistorySchema.index({ 'result.brand': 1 });

const ScanHistory = mongoose.model('ScanHistory', scanHistorySchema);

export default ScanHistory;
