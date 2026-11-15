import axios from 'axios';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { FallbackRuleEngine } from './fallbackRuleEngine.js';

const client = axios.create({
  baseURL: config.aiService.url,
  timeout: config.aiService.timeoutMs,
  headers: {
    'Content-Type': 'application/json',
    'X-Internal-Service-Token': config.aiService.token,
  },
});

export const aiServiceClient = {
  async analyzeMessage(content, senderHeader) {
    try {
      const response = await client.post('/message/analyze', {
        content,
        sender_header: senderHeader,
        consent_granted: true,
      });
      return response.data;
    } catch (err) {
      logger.warn('AI Microservice unavailable for message analysis, activating Fallback Rule Engine', {
        error: err.message,
      });
      return FallbackRuleEngine.evaluateMessage(content, senderHeader);
    }
  },

  async analyzeQr(qrPayload, fileBuffer) {
    try {
      if (fileBuffer) {
        // When file upload is passed, use multipart
        const FormData = (await import('form-data')).default;
        const form = new FormData();
        form.append('file', fileBuffer, { filename: 'qr.png', contentType: 'image/png' });
        const response = await client.post('/qr/analyze-image', form, {
          headers: form.getHeaders(),
        });
        return response.data;
      }

      const response = await client.post('/qr/analyze-text', {
        qr_payload: qrPayload,
        consent_granted: true,
      });
      return response.data;
    } catch (err) {
      logger.warn('AI Microservice unavailable for QR analysis, activating Fallback Rule Engine', {
        error: err.message,
      });
      return FallbackRuleEngine.evaluateQr(qrPayload);
    }
  },

  async analyzeUrl(url) {
    try {
      const response = await client.post('/url/inspect', {
        url,
        consent_granted: true,
      });
      return response.data;
    } catch (err) {
      logger.warn('AI Microservice unavailable for URL inspection, activating Fallback Rule Engine', {
        error: err.message,
      });
      return FallbackRuleEngine.evaluateUrl(url);
    }
  },
};
