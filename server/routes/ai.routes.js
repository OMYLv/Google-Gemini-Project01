const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { validateRequest, schemas } = require('../middleware/validation');

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

module.exports = router;
