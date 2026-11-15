import { apiClient, USE_MOCKS } from './api';
import { INDIAN_BANKS_DIRECTORY } from '../constants/indianBanks';

export const incidentService = {
  async reportIncident(payload) {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        success: true,
        data: {
          incidentId: 'inc-' + Date.now(),
          cybercrimeComplaintDraft: {
            portalUrl: 'https://cybercrime.gov.in',
            helpline: '1930',
            prefilledSummary: `Unauthorized ${payload.incidentType || 'Transaction'} of INR ${payload.financialLossInr || '0.00'} reported on FraudShield. Transaction Reference: ${payload.transactionRefRrn || 'N/A'}.`,
          },
          bankEmergencyActions: {
            bankName: payload.bankName || 'Your Bank',
            tollFree: '1930',
            smsBlockSyntax: 'BLOCK to official bank shortcode',
          },
        },
      };
    }
    const response = await apiClient.post('/incidents/report', payload);
    return response.data;
  },

  getBankDirectory() {
    return INDIAN_BANKS_DIRECTORY;
  },
};
