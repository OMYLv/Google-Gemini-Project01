const express = require('express');
const router = express.Router();

// Import route modules
const aiRoutes = require('./ai.routes');

// Mount routes
router.use('/ai', aiRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'Universal Bridge AI API',
    version: '1.0.0',
    description: 'Gemini-powered bridge between human intent and complex systems',
    endpoints: {
      health: '/health',
      ai: {
        text: 'POST /api/ai/process/text',
        multimodal: 'POST /api/ai/process/multimodal',
        voice: 'POST /api/ai/process/voice',
        batch: 'POST /api/ai/process/batch',
        capabilities: 'GET /api/ai/capabilities'
      }
    },
    documentation: 'https://github.com/yourusername/universal-bridge-ai'
  });
});

module.exports = router;
