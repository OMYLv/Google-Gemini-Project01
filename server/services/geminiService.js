const { GoogleGenerativeAI } = require('@google/generative-ai');
const { logger } = require('../utils/logger');

class GeminiService {
  constructor() {
    // Development mode: Use mock responses if no API key
    this.useMockMode = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here';
    
    if (this.useMockMode) {
      logger.warn('⚠️  Running in MOCK MODE - No Gemini API key configured. Using hardcoded responses.');
      logger.warn('⚠️  Get your free API key at: https://makersuite.google.com/app/apikey');
    } else {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      this.visionModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  /**
   * Process text input and generate structured actions
   */
  async processTextInput(input, context = '', priority = 'medium') {
    try {
      // Use mock response if in development mode
      if (this.useMockMode) {
        return this.getMockTextResponse(input, context, priority);
      }
      
      const prompt = this.buildPrompt(input, context, priority);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseStructuredResponse(text);
    } catch (error) {
      logger.error('Error in processTextInput:', error);
      throw new Error('Failed to process text input');
    }
  }

  /**
   * Process multi-modal input (text + images)
   */
  async processMultiModal(data) {
    try {
      // Use mock response if in development mode
      if (this.useMockMode) {
        return this.getMockMultiModalResponse(data);
      }
      
      const { text, imageData, useCase } = data;
      const prompt = this.buildMultiModalPrompt(text, useCase);
      
      const parts = [{ text: prompt }];
      
      if (imageData) {
        // Remove data URL prefix if present
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg'
          }
        });
      }
      
      const result = await this.visionModel.generateContent(parts);
      const response = await result.response;
      const responseText = response.text();
      
      return this.parseStructuredResponse(responseText);
    } catch (error) {
      logger.error('Error in processMultiModal:', error);
      throw new Error('Failed to process multi-modal input');
    }
  }

  /**
   * Build prompt for text processing
   */
  buildPrompt(input, context, priority) {
    return `You are an AI assistant that converts unstructured human input into structured, actionable data for life-saving and societal benefit purposes.

PRIORITY LEVEL: ${priority.toUpperCase()}
CONTEXT: ${context || 'General inquiry'}
INPUT: ${input}

Analyze the input and provide a structured response in the following JSON format:
{
  "inputType": "medical|traffic|weather|news|emergency|general",
  "urgencyLevel": "low|medium|high|critical",
  "extractedData": {
    "summary": "Brief summary of the situation",
    "keyPoints": ["point1", "point2", "point3"],
    "entities": {
      "people": [],
      "locations": [],
      "times": [],
      "conditions": []
    }
  },
  "recommendedActions": [
    {
      "action": "Specific action to take",
      "priority": "low|medium|high|critical",
      "responsible": "Who should perform this action",
      "timeframe": "When this should be done"
    }
  ],
  "alerts": [
    {
      "type": "warning|info|critical",
      "message": "Alert message"
    }
  ],
  "verificationStatus": "verified|needs-verification|uncertain",
  "confidence": 0.0-1.0
}

Focus on actionable insights that can save lives or provide significant societal benefit.`;
  }

  /**
   * Build prompt for multi-modal processing
   */
  buildMultiModalPrompt(text, useCase) {
    const useCasePrompts = {
      medical: 'Analyze this medical information (image and/or text) and provide structured triage recommendations, identifying critical symptoms and suggested immediate actions.',
      traffic: 'Analyze this traffic situation and provide a structured incident report with severity assessment, location details, and recommended responses.',
      weather: 'Analyze this weather information and generate structured alerts with safety recommendations and affected areas.',
      news: 'Analyze this news content and extract actionable insights, fact-check claims, and identify societal impact.',
      general: 'Analyze this input and provide structured, actionable insights.'
    };

    return `${useCasePrompts[useCase] || useCasePrompts.general}

${text ? `TEXT INPUT: ${text}` : ''}

Provide your response in structured JSON format with:
- Input classification
- Urgency assessment
- Extracted key data
- Recommended actions
- Alerts/warnings
- Confidence level

Focus on accuracy, actionability, and potential for societal benefit.`;
  }

  /**
   * Parse AI response into structured format
   */
  parseStructuredResponse(text) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: create structured response from text
      return {
        inputType: 'general',
        urgencyLevel: 'medium',
        extractedData: {
          summary: text.substring(0, 500),
          keyPoints: [text],
          entities: {}
        },
        recommendedActions: [{
          action: 'Review AI analysis',
          priority: 'medium',
          responsible: 'User',
          timeframe: 'As needed'
        }],
        alerts: [],
        verificationStatus: 'needs-verification',
        confidence: 0.7,
        rawResponse: text
      };
    } catch (error) {
      logger.error('Error parsing response:', error);
      throw new Error('Failed to parse AI response');
    }
  }

  /**
   * Process voice/audio input (converted to text)
   */
  async processVoiceInput(transcribedText, context = '') {
    return this.processTextInput(transcribedText, context, 'high');
  }

  /**
   * Batch process multiple inputs
   */
  async batchProcess(inputs) {
    try {
      const results = await Promise.allSettled(
        inputs.map(input => this.processTextInput(input.text, input.context, input.priority))
      );
      
      return results.map((result, index) => ({
        id: inputs[index].id || index,
        status: result.status,
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null
      }));
    } catch (error) {
      logger.error('Error in batch processing:', error);
      throw new Error('Failed to process batch');
    }
  }

  /**
   * Get mock text response for development/testing
   */
  getMockTextResponse(input, context, priority) {
    const inputLower = input.toLowerCase();
    
    // Detect use case from input
    let inputType = 'general';
    let urgencyLevel = priority;
    let mockData = {};
    
    if (inputLower.includes('chest pain') || inputLower.includes('patient') || inputLower.includes('medical') || inputLower.includes('injury')) {
      inputType = 'medical';
      urgencyLevel = 'critical';
      mockData = {
        summary: 'Patient presenting with potential cardiac symptoms requiring immediate medical attention.',
        keyPoints: [
          'Chest pain is a critical symptom requiring immediate evaluation',
          'Cardiac enzyme testing and ECG recommended',
          'Patient should be monitored continuously',
          'Emergency response protocols should be activated'
        ],
        entities: {
          people: ['Patient'],
          locations: [],
          times: ['Immediate'],
          conditions: ['chest pain', 'potential acute coronary syndrome']
        }
      };
    } else if (inputLower.includes('accident') || inputLower.includes('traffic') || inputLower.includes('collision') || inputLower.includes('crash')) {
      inputType = 'traffic';
      urgencyLevel = 'high';
      mockData = {
        summary: 'Traffic incident reported requiring emergency response and traffic management.',
        keyPoints: [
          'Multiple vehicles involved',
          'Emergency services dispatch required',
          'Traffic flow disruption expected',
          'Scene safety assessment needed'
        ],
        entities: {
          people: ['Emergency responders', 'Affected drivers'],
          locations: ['Incident location'],
          times: ['Immediate response needed'],
          conditions: ['Traffic disruption', 'Possible injuries']
        }
      };
    } else if (inputLower.includes('weather') || inputLower.includes('storm') || inputLower.includes('tornado') || inputLower.includes('hurricane')) {
      inputType = 'weather';
      urgencyLevel = 'critical';
      mockData = {
        summary: 'Severe weather event requiring immediate public safety response and community alerts.',
        keyPoints: [
          'Severe weather conditions detected',
          'Public shelter recommendations needed',
          'Emergency alert systems should be activated',
          'Monitor weather updates continuously'
        ],
        entities: {
          people: ['Affected residents', 'Emergency services'],
          locations: ['Affected areas'],
          times: ['Duration of alert'],
          conditions: ['Severe weather', 'Safety hazard']
        }
      };
    } else if (inputLower.includes('news') || inputLower.includes('article') || inputLower.includes('report')) {
      inputType = 'news';
      urgencyLevel = 'medium';
      mockData = {
        summary: 'News content analyzed for factual accuracy and community impact assessment.',
        keyPoints: [
          'Source verification recommended',
          'Cross-reference with credible sources',
          'Assess community impact',
          'Monitor for updates'
        ],
        entities: {
          people: [],
          locations: [],
          times: [],
          conditions: []
        }
      };
    } else {
      mockData = {
        summary: `Analyzed input: "${input.substring(0, 100)}${input.length > 100 ? '...' : ''}"`,
        keyPoints: [
          'Input successfully processed',
          'Structured analysis generated',
          'Recommendations provided based on context',
          'Further verification recommended'
        ],
        entities: {
          people: [],
          locations: [],
          times: [],
          conditions: []
        }
      };
    }

    return {
      inputType,
      urgencyLevel,
      extractedData: mockData,
      recommendedActions: this.getMockActions(inputType, urgencyLevel),
      alerts: this.getMockAlerts(inputType, urgencyLevel),
      verificationStatus: 'needs-verification',
      confidence: 0.85,
      _mockMode: true
    };
  }

  /**
   * Get mock multimodal response
   */
  getMockMultiModalResponse(data) {
    const { text, useCase } = data;
    const hasImage = !!data.imageData;
    
    let mockData = {};
    let urgencyLevel = 'medium';
    
    switch (useCase) {
      case 'medical':
        urgencyLevel = 'high';
        mockData = {
          summary: 'Medical image and description analyzed. Preliminary assessment suggests professional medical evaluation needed.',
          keyPoints: [
            'Visual indicators observed in uploaded image',
            'Text description provides additional context',
            'Medical professional consultation recommended',
            'Document findings for medical record'
          ],
          entities: {
            people: ['Patient'],
            conditions: ['Condition requiring evaluation']
          }
        };
        break;
      
      case 'traffic':
        urgencyLevel = 'high';
        mockData = {
          summary: 'Traffic incident scene analyzed from image and description. Emergency response coordination recommended.',
          keyPoints: [
            'Incident scene documented',
            'Vehicle positions and damage assessed',
            'Safety hazards identified',
            'Traffic control measures needed'
          ],
          entities: {
            locations: ['Incident scene'],
            conditions: ['Traffic obstruction', 'Safety hazard']
          }
        };
        break;
      
      case 'weather':
        urgencyLevel = 'critical';
        mockData = {
          summary: 'Weather damage assessment from visual evidence and description. Community safety response required.',
          keyPoints: [
            'Damage extent documented in image',
            'Infrastructure impact identified',
            'Public safety concerns noted',
            'Emergency services coordination needed'
          ],
          entities: {
            locations: ['Affected area'],
            conditions: ['Weather damage', 'Infrastructure impact']
          }
        };
        break;
      
      default:
        mockData = {
          summary: hasImage 
            ? 'Multi-modal input (image + text) processed successfully.' 
            : 'Text input for ' + useCase + ' use case analyzed.',
          keyPoints: [
            'Input data received and processed',
            hasImage ? 'Image content analyzed' : 'Text content analyzed',
            'Structured output generated',
            'Recommendations provided'
          ],
          entities: {}
        };
    }

    return {
      inputType: useCase,
      urgencyLevel,
      extractedData: mockData,
      recommendedActions: this.getMockActions(useCase, urgencyLevel),
      alerts: this.getMockAlerts(useCase, urgencyLevel),
      verificationStatus: 'needs-verification',
      confidence: hasImage ? 0.80 : 0.75,
      _mockMode: true
    };
  }

  /**
   * Get mock recommended actions
   */
  getMockActions(inputType, urgencyLevel) {
    const actions = {
      medical: [
        {
          action: 'Immediate medical evaluation by qualified healthcare provider',
          priority: 'critical',
          responsible: 'Emergency Medical Services',
          timeframe: 'Immediate - within 10 minutes'
        },
        {
          action: 'Perform vital signs assessment and monitoring',
          priority: 'high',
          responsible: 'Medical Staff',
          timeframe: 'Immediate'
        },
        {
          action: 'Document symptoms and medical history',
          priority: 'medium',
          responsible: 'Healthcare Provider',
          timeframe: 'Within 30 minutes'
        }
      ],
      traffic: [
        {
          action: 'Dispatch emergency services to scene',
          priority: 'high',
          responsible: 'Emergency Dispatcher',
          timeframe: 'Immediate'
        },
        {
          action: 'Implement traffic control measures',
          priority: 'high',
          responsible: 'Traffic Management',
          timeframe: 'Within 15 minutes'
        },
        {
          action: 'Assess and document scene for investigation',
          priority: 'medium',
          responsible: 'Law Enforcement',
          timeframe: 'Within 1 hour'
        }
      ],
      weather: [
        {
          action: 'Activate emergency alert systems',
          priority: 'critical',
          responsible: 'Emergency Management',
          timeframe: 'Immediate'
        },
        {
          action: 'Issue public shelter recommendations',
          priority: 'critical',
          responsible: 'Public Safety Officials',
          timeframe: 'Immediate'
        },
        {
          action: 'Monitor weather conditions continuously',
          priority: 'high',
          responsible: 'Weather Service',
          timeframe: 'Ongoing'
        }
      ],
      news: [
        {
          action: 'Verify information with credible sources',
          priority: 'high',
          responsible: 'Editorial Team',
          timeframe: 'Before publication'
        },
        {
          action: 'Cross-reference facts and claims',
          priority: 'medium',
          responsible: 'Fact-checking Team',
          timeframe: 'Within 24 hours'
        }
      ],
      general: [
        {
          action: 'Review and analyze provided information',
          priority: urgencyLevel,
          responsible: 'Appropriate Personnel',
          timeframe: 'As needed'
        },
        {
          action: 'Take context-appropriate action',
          priority: 'medium',
          responsible: 'Relevant Authority',
          timeframe: 'Based on situation'
        }
      ]
    };

    return actions[inputType] || actions.general;
  }

  /**
   * Get mock alerts
   */
  getMockAlerts(inputType, urgencyLevel) {
    const alerts = {
      medical: [
        {
          type: 'critical',
          message: 'Immediate medical attention required - do not delay treatment'
        },
        {
          type: 'warning',
          message: 'This is a demo response. Always consult qualified medical professionals for real medical situations.'
        }
      ],
      traffic: [
        {
          type: 'warning',
          message: 'Traffic disruption expected - seek alternate routes'
        }
      ],
      weather: [
        {
          type: 'critical',
          message: 'Severe weather alert - take immediate protective action'
        }
      ],
      news: [
        {
          type: 'info',
          message: 'Information requires verification from multiple credible sources'
        }
      ],
      general: []
    };

    // Add demo mode alert
    const result = alerts[inputType] || alerts.general;
    result.push({
      type: 'info',
      message: '🔧 DEMO MODE: Using hardcoded responses. Add your Gemini API key to .env for real AI analysis.'
    });

    return result;
  }
}

module.exports = new GeminiService();
