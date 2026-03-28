const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }
    
    next();
  };
};

// Common validation schemas
const schemas = {
  textInput: Joi.object({
    input: Joi.string().required().max(10000),
    context: Joi.string().optional().max(5000),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium')
  }),

  multiModalInput: Joi.object({
    text: Joi.string().optional().max(10000),
    imageData: Joi.string().optional(),
    audioData: Joi.string().optional(),
    context: Joi.object().optional(),
    useCase: Joi.string().valid(
      'medical',
      'traffic',
      'weather',
      'news',
      'general'
    ).required()
  })
};

module.exports = { validateRequest, schemas };
