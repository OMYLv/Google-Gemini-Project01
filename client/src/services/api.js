import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const aiService = {
  /**
   * Process text input
   */
  processText: async (input, context = '', priority = 'medium') => {
    const response = await api.post('/ai/process/text', {
      input,
      context,
      priority,
    });
    return response.data;
  },

  /**
   * Process multi-modal input
   */
  processMultiModal: async (data) => {
    const response = await api.post('/ai/process/multimodal', data);
    return response.data;
  },

  /**
   * Process voice input
   */
  processVoice: async (transcribedText, context = '') => {
    const response = await api.post('/ai/process/voice', {
      transcribedText,
      context,
    });
    return response.data;
  },

  /**
   * Batch process inputs
   */
  processBatch: async (inputs) => {
    const response = await api.post('/ai/process/batch', { inputs });
    return response.data;
  },

  /**
   * Get AI capabilities
   */
  getCapabilities: async () => {
    const response = await api.get('/ai/capabilities');
    return response.data;
  },
};

export const healthCheck = async () => {
  const response = await axios.get('/health');
  return response.data;
};

export default api;
