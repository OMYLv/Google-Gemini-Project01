const geminiService = require('../services/geminiService');
const cloudStorageService = require('../services/cloudStorageService');
const visionService = require('../services/visionService');
const languageService = require('../services/languageService');
const cacheService = require('../services/cacheService');
const { logger } = require('../utils/logger');

class AIController {
  /**
   * Process text input
   */
  async processText(req, res, next) {
    try {
      const { input, context, priority } = req.body;
      
      logger.info('Processing text input', { 
        inputLength: input.length, 
        priority 
      });
      
      const result = await geminiService.processTextInput(input, context, priority);
      
      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Process multi-modal input
   */
  async processMultiModal(req, res, next) {
    try {
      const data = req.body;
      
      logger.info('Processing multi-modal input', { 
        useCase: data.useCase,
        hasImage: !!data.imageData,
        hasText: !!data.text
      });
      
      const result = await geminiService.processMultiModal(data);
      
      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Process voice input
   */
  async processVoice(req, res, next) {
    try {
      const { transcribedText, context } = req.body;
      
      logger.info('Processing voice input', { 
        textLength: transcribedText.length 
      });
      
      const result = await geminiService.processVoiceInput(transcribedText, context);
      
      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Batch process multiple inputs
   */
  async processBatch(req, res, next) {
    try {
      const { inputs } = req.body;
      
      if (!Array.isArray(inputs) || inputs.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'inputs must be a non-empty array'
        });
      }

      if (inputs.length > 10) {
        return res.status(400).json({
          success: false,
          error: 'Maximum 10 inputs allowed per batch'
        });
      }
      
      logger.info('Processing batch', { count: inputs.length });
      
      const results = await geminiService.batchProcess(inputs);
      
      res.status(200).json({
        success: true,
        data: results,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get service health and capabilities
   */
  async getCapabilities(req, res) {
    res.status(200).json({
      success: true,
      capabilities: {
        textProcessing: true,
        imageProcessing: true,
        voiceProcessing: true,
        batchProcessing: true,
        cloudStorage: true,
        visionAnalysis: true,
        languageAnalysis: true,
        supportedUseCases: ['medical', 'traffic', 'weather', 'news', 'general'],
        supportedPriorities: ['low', 'medium', 'high', 'critical'],
        maxBatchSize: 10,
        maxInputLength: 10000
      }
    });
  }

  /**
   * Upload file to Cloud Storage
   */
  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      logger.info('Uploading file', { 
        filename: req.file.originalname,
        size: req.file.size
      });

      const result = await cloudStorageService.uploadFile(req.file);

      // Analyze image if it's an image file
      let analysis = null;
      if (req.file.mimetype.startsWith('image/')) {
        analysis = await visionService.analyzeImage(req.file.buffer);
      }

      res.status(200).json({
        success: true,
        data: {
          ...result,
          analysis
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Analyze image with Vision API
   */
  async analyzeImage(req, res, next) {
    try {
      const { imageData } = req.body;

      if (!imageData) {
        return res.status(400).json({
          success: false,
          error: 'No image data provided'
        });
      }

      // Check cache first
      const cacheKey = `vision:${Buffer.from(imageData).toString('base64').substring(0, 50)}`;
      const cached = cacheService.get(cacheKey);
      if (cached) {
        return res.status(200).json({
          success: true,
          data: cached,
          cached: true,
          timestamp: new Date().toISOString()
        });
      }

      logger.info('Analyzing image with Vision API');

      const imageBuffer = Buffer.from(imageData, 'base64');
      const result = await visionService.analyzeImage(imageBuffer);

      // Cache the result
      cacheService.set(cacheKey, result, 3600);

      res.status(200).json({
        success: true,
        data: result,
        cached: false,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(req, res, next) {
    try {
      const { text } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Text is required'
        });
      }

      // Check cache first
      const cacheKey = `sentiment:${text.substring(0, 100)}`;
      const cached = cacheService.get(cacheKey);
      if (cached) {
        return res.status(200).json({
          success: true,
          data: cached,
          cached: true,
          timestamp: new Date().toISOString()
        });
      }

      logger.info('Analyzing sentiment', { textLength: text.length });

      const result = await languageService.analyzeSentiment(text);

      // Cache the result
      cacheService.set(cacheKey, result, 1800);

      res.status(200).json({
        success: true,
        data: result,
        cached: false,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Extract entities from text
   */
  async extractEntities(req, res, next) {
    try {
      const { text } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Text is required'
        });
      }

      logger.info('Extracting entities', { textLength: text.length });

      const result = await languageService.analyzeEntities(text);

      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Classify text into categories
   */
  async classifyText(req, res, next) {
    try {
      const { text } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Text is required'
        });
      }

      logger.info('Classifying text', { textLength: text.length });

      const result = await languageService.classifyText(text);

      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(req, res) {
    const stats = cacheService.getStats();
    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Clear cache
   */
  async clearCache(req, res) {
    cacheService.flush();
    res.status(200).json({
      success: true,
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new AIController();
