const { schemas } = require('../server/middleware/validation');

describe('Input Validation Tests', () => {
  describe('Text Input Schema', () => {
    it('should validate correct text input', () => {
      const validInput = {
        input: 'Test input',
        context: 'Test context',
        priority: 'medium'
      };

      const { error } = schemas.textInput.validate(validInput);
      expect(error).toBeUndefined();
    });

    it('should reject empty input', () => {
      const invalidInput = {
        input: '',
        priority: 'medium'
      };

      const { error } = schemas.textInput.validate(invalidInput);
      expect(error).toBeDefined();
    });

    it('should reject invalid priority', () => {
      const invalidInput = {
        input: 'Test',
        priority: 'invalid'
      };

      const { error } = schemas.textInput.validate(invalidInput);
      expect(error).toBeDefined();
    });

    it('should reject input exceeding max length', () => {
      const invalidInput = {
        input: 'a'.repeat(10001),
        priority: 'medium'
      };

      const { error } = schemas.textInput.validate(invalidInput);
      expect(error).toBeDefined();
    });
  });

  describe('Multi-Modal Input Schema', () => {
    it('should validate correct multimodal input', () => {
      const validInput = {
        text: 'Test text',
        useCase: 'medical'
      };

      const { error } = schemas.multiModalInput.validate(validInput);
      expect(error).toBeUndefined();
    });

    it('should reject invalid useCase', () => {
      const invalidInput = {
        text: 'Test',
        useCase: 'invalid'
      };

      const { error } = schemas.multiModalInput.validate(invalidInput);
      expect(error).toBeDefined();
    });

    it('should require useCase field', () => {
      const invalidInput = {
        text: 'Test'
      };

      const { error } = schemas.multiModalInput.validate(invalidInput);
      expect(error).toBeDefined();
    });
  });
});
