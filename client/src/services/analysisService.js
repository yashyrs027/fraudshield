import { apiClient, USE_MOCKS } from './api';
import { MOCK_RECENT_ANALYSES, MOCK_DETAILED_ASSESSMENTS } from './mockData';

export const analysisService = {
  async analyzeMessage({ content, senderHeader, file, consentGranted }) {
    if (USE_MOCKS) {
      // Simulate realistic ML inference latency (800ms)
      await new Promise((resolve) => setTimeout(resolve, 800));

      const lower = (content || '').toLowerCase();
      let mockResult = { ...MOCK_DETAILED_ASSESSMENTS['sess-001'] };

      if (lower.includes('salary') || lower.includes('credited') || lower.includes('deposited')) {
        mockResult = {
          sessionId: 'sess-' + Date.now(),
          inputType: 'TEXT_MESSAGE',
          riskScore: 10,
          riskLevel: 'SAFE',
          scamCategory: 'LEGITIMATE_TRANSACTION',
          title: 'Verified Bank Credit Notification',
          summaryVerdict: 'Standard authentic banking credit alert. No threat cues found.',
          actionableAdvice: [
            'This appears to be a legitimate banking alert.',
            'No credentials or sensitive actions were requested.',
            'Always check your official bank app balance to confirm credits.',
          ],
          threatBreakdown: { urgencyScore: 5, headerMismatch: 5, linkRisk: 0, contactRisk: 0 },
          factorContributions: [
            { factor: 'Linguistic Urgency', weight: 28, score: 5 },
            { factor: 'Sender Verification', weight: 22, score: 10 },
            { factor: 'Link Safety', weight: 34, score: 0 },
            { factor: 'Header Authenticity', weight: 16, score: 5 },
          ],
          indicators: [
            {
              id: 'ind-safe-1',
              code: 'AUTHENTIC_BANK_HEADER',
              severity: 'INFO',
              title: 'Standard Transaction Grammar',
              description: 'Message contains legitimate transaction syntax and lacks panic inducements.',
            },
          ],
          extractedEntities: {
            senderHeader: senderHeader || 'AD-HDFCBK',
            phoneNumbers: [],
            urls: [],
          },
          rawContent: content,
          evaluatedAt: new Date().toISOString(),
        };
      } else {
        mockResult.sessionId = 'sess-' + Date.now();
        mockResult.rawContent = content || 'Uploaded Screenshot Analysis';
        if (senderHeader) mockResult.extractedEntities.senderHeader = senderHeader;
      }
      return { success: true, data: mockResult };
    }

    // Real API Implementation
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      if (content) formData.append('content', content);
      if (senderHeader) formData.append('senderHeader', senderHeader);
      formData.append('consentGranted', consentGranted);
      const response = await apiClient.post('/analyze/message', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }

    const response = await apiClient.post('/analyze/message', {
      content,
      senderHeader,
      consentGranted,
    });
    return response.data;
  },

  async analyzeQr({ file, qrPayload, consentGranted }) {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 950));
      const mockResult = {
        ...MOCK_DETAILED_ASSESSMENTS['sess-002'],
        sessionId: 'sess-' + Date.now(),
        evaluatedAt: new Date().toISOString(),
      };
      if (qrPayload) {
        mockResult.extractedEntities.rawPayload = qrPayload;
      }
      return { success: true, data: mockResult };
    }

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('consentGranted', consentGranted);
      const response = await apiClient.post('/analyze/qr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }

    const response = await apiClient.post('/analyze/qr', {
      qrPayload,
      consentGranted,
    });
    return response.data;
  },

  async analyzeUrl({ url, consentGranted }) {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 750));
      const mockResult = {
        ...MOCK_DETAILED_ASSESSMENTS['sess-003'],
        sessionId: 'sess-' + Date.now(),
        extractedEntities: {
          ...MOCK_DETAILED_ASSESSMENTS['sess-003'].extractedEntities,
          inputUrl: url,
        },
        evaluatedAt: new Date().toISOString(),
      };
      return { success: true, data: mockResult };
    }

    const response = await apiClient.post('/analyze/url', {
      url,
      consentGranted,
    });
    return response.data;
  },

  async getAssessmentById(sessionId) {
    if (USE_MOCKS) {
      const cached = MOCK_DETAILED_ASSESSMENTS[sessionId];
      if (cached) return { success: true, data: cached };
      // Fallback default
      return { success: true, data: MOCK_DETAILED_ASSESSMENTS['sess-001'] };
    }
    const response = await apiClient.get(`/assessments/${sessionId}`);
    return response.data;
  },

  async getHistory() {
    if (USE_MOCKS) {
      return {
        success: true,
        data: {
          items: MOCK_RECENT_ANALYSES,
          pagination: { currentPage: 1, totalPages: 1, totalRecords: MOCK_RECENT_ANALYSES.length },
        },
      };
    }
    const response = await apiClient.get('/assessments/history');
    return response.data;
  },
};
