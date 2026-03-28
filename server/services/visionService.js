const vision = require('@google-cloud/vision');
const { logger } = require('../utils/logger');

class VisionService {
  constructor() {
    this.useMockMode = !process.env.GOOGLE_CLOUD_PROJECT;
    
    if (this.useMockMode) {
      logger.warn('⚠️  Running Vision API in MOCK MODE - No GCP project configured');
    } else {
      this.client = new vision.ImageAnnotatorClient();
    }
  }

  /**
   * Analyze image with Google Cloud Vision API
   */
  async analyzeImage(imageBuffer) {
    try {
      if (this.useMockMode) {
        return this.getMockVisionResponse();
      }

      const [result] = await this.client.annotateImage({
        image: { content: imageBuffer.toString('base64') },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 10 },
          { type: 'TEXT_DETECTION' },
          { type: 'FACE_DETECTION' },
          { type: 'OBJECT_LOCALIZATION' },
          { type: 'IMAGE_PROPERTIES' },
          { type: 'SAFE_SEARCH_DETECTION' }
        ]
      });

      return {
        labels: result.labelAnnotations || [],
        text: result.textAnnotations?.[0]?.description || '',
        faces: result.faceAnnotations?.length || 0,
        objects: result.localizedObjectAnnotations || [],
        colors: result.imagePropertiesAnnotation?.dominantColors?.colors || [],
        safeSearch: result.safeSearchAnnotation
      };
    } catch (error) {
      logger.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image');
    }
  }

  /**
   * Detect text in image (OCR)
   */
  async detectText(imageBuffer) {
    try {
      if (this.useMockMode) {
        return { text: 'Sample detected text from image (mock mode)' };
      }

      const [result] = await this.client.textDetection(imageBuffer);
      const detections = result.textAnnotations;
      
      return {
        text: detections?.[0]?.description || '',
        words: detections?.slice(1) || []
      };
    } catch (error) {
      logger.error('Error detecting text:', error);
      throw new Error('Failed to detect text');
    }
  }

  /**
   * Detect objects in image
   */
  async detectObjects(imageBuffer) {
    try {
      if (this.useMockMode) {
        return this.getMockObjectDetection();
      }

      const [result] = await this.client.objectLocalization(imageBuffer);
      const objects = result.localizedObjectAnnotations;

      return objects.map(object => ({
        name: object.name,
        confidence: object.score,
        boundingBox: object.boundingPoly
      }));
    } catch (error) {
      logger.error('Error detecting objects:', error);
      throw new Error('Failed to detect objects');
    }
  }

  /**
   * Mock vision response
   */
  getMockVisionResponse() {
    return {
      labels: [
        { description: 'Technology', score: 0.95 },
        { description: 'Computer', score: 0.89 },
        { description: 'Electronics', score: 0.87 }
      ],
      text: 'Sample text detected in image',
      faces: 0,
      objects: [
        { name: 'Computer monitor', score: 0.92 },
        { name: 'Keyboard', score: 0.88 }
      ],
      colors: [
        { color: { red: 50, green: 100, blue: 200 }, score: 0.4, pixelFraction: 0.3 }
      ],
      safeSearch: {
        adult: 'VERY_UNLIKELY',
        violence: 'VERY_UNLIKELY',
        racy: 'UNLIKELY'
      }
    };
  }

  /**
   * Mock object detection
   */
  getMockObjectDetection() {
    return [
      { name: 'Person', confidence: 0.95, boundingBox: {} },
      { name: 'Laptop', confidence: 0.89, boundingBox: {} }
    ];
  }
}

module.exports = new VisionService();
