const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiController = require('../controllers/aiController');
const { validateRequest, schemas } = require('../middleware/validation');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Text processing endpoint
router.post('/process/text', 
  validateRequest(schemas.textInput),
  aiController.processText
);

// Multi-modal processing endpoint
router.post('/process/multimodal',
  validateRequest(schemas.multiModalInput),
  aiController.processMultiModal
);

// Voice processing endpoint
router.post('/process/voice',
  aiController.processVoice
);

// Batch processing endpoint
router.post('/process/batch',
  aiController.processBatch
);

// Get AI capabilities
router.get('/capabilities',
  aiController.getCapabilities
);

// Google Cloud Storage endpoints
router.post('/storage/upload',
  upload.single('file'),
  aiController.uploadFile
);

// Google Cloud Vision endpoints
router.post('/vision/analyze',
  aiController.analyzeImage
);

// Google Cloud Natural Language endpoints
router.post('/language/sentiment',
  aiController.analyzeSentiment
);

router.post('/language/entities',
  aiController.extractEntities
);

router.post('/language/classify',
  aiController.classifyText
);

// Cache management endpoints
router.get('/cache/stats',
  aiController.getCacheStats
);

router.post('/cache/clear',
  aiController.clearCache
);

module.exports = router;
