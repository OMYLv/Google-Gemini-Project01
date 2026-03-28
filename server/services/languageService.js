const language = require('@google-cloud/language');
const { logger } = require('../utils/logger');

class LanguageService {
  constructor() {
    this.useMockMode = !process.env.GOOGLE_CLOUD_PROJECT;
    
    if (this.useMockMode) {
      logger.warn('⚠️  Running Natural Language API in MOCK MODE - No GCP project configured');
    } else {
      this.client = new language.LanguageServiceClient();
    }
  }

  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(text) {
    try {
      if (this.useMockMode) {
        return this.getMockSentiment();
      }

      const document = {
        content: text,
        type: 'PLAIN_TEXT'
      };

      const [result] = await this.client.analyzeSentiment({ document });
      const sentiment = result.documentSentiment;

      return {
        score: sentiment.score,
        magnitude: sentiment.magnitude,
        sentiment: this.interpretSentiment(sentiment.score)
      };
    } catch (error) {
      logger.error('Error analyzing sentiment:', error);
      throw new Error('Failed to analyze sentiment');
    }
  }

  /**
   * Extract entities from text
   */
  async analyzeEntities(text) {
    try {
      if (this.useMockMode) {
        return this.getMockEntities();
      }

      const document = {
        content: text,
        type: 'PLAIN_TEXT'
      };

      const [result] = await this.client.analyzeEntities({ document });

      return result.entities.map(entity => ({
        name: entity.name,
        type: entity.type,
        salience: entity.salience,
        mentions: entity.mentions?.length || 0
      }));
    } catch (error) {
      logger.error('Error analyzing entities:', error);
      throw new Error('Failed to analyze entities');
    }
  }

  /**
   * Classify text into categories
   */
  async classifyText(text) {
    try {
      if (this.useMockMode) {
        return this.getMockClassification();
      }

      const document = {
        content: text,
        type: 'PLAIN_TEXT'
      };

      const [classification] = await this.client.classifyText({ document });

      return classification.categories.map(category => ({
        name: category.name,
        confidence: category.confidence
      }));
    } catch (error) {
      logger.error('Error classifying text:', error);
      throw new Error('Failed to classify text');
    }
  }

  /**
   * Analyze syntax of text
   */
  async analyzeSyntax(text) {
    try {
      if (this.useMockMode) {
        return { tokenCount: text.split(' ').length };
      }

      const document = {
        content: text,
        type: 'PLAIN_TEXT'
      };

      const [syntax] = await this.client.analyzeSyntax({ document });

      return {
        tokens: syntax.tokens?.length || 0,
        sentences: syntax.sentences?.length || 0
      };
    } catch (error) {
      logger.error('Error analyzing syntax:', error);
      throw new Error('Failed to analyze syntax');
    }
  }

  /**
   * Interpret sentiment score
   */
  interpretSentiment(score) {
    if (score >= 0.25) return 'positive';
    if (score <= -0.25) return 'negative';
    return 'neutral';
  }

  /**
   * Mock responses
   */
  getMockSentiment() {
    return {
      score: 0.5,
      magnitude: 0.8,
      sentiment: 'positive'
    };
  }

  getMockEntities() {
    return [
      { name: 'Google', type: 'ORGANIZATION', salience: 0.9, mentions: 3 },
      { name: 'Cloud Platform', type: 'OTHER', salience: 0.7, mentions: 2 }
    ];
  }

  getMockClassification() {
    return [
      { name: '/Computers & Electronics/Software', confidence: 0.95 },
      { name: '/Internet & Telecom/Cloud Storage', confidence: 0.88 }
    ];
  }
}

module.exports = new LanguageService();
