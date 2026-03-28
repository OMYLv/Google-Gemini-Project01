const geminiService = require('../services/geminiService');
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
        supportedUseCases: ['medical', 'traffic', 'weather', 'news', 'general'],
        supportedPriorities: ['low', 'medium', 'high', 'critical'],
        maxBatchSize: 10,
        maxInputLength: 10000
      }
    });
  }
}

module.exports = new AIController();
