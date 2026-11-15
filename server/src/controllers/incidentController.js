import { memoryStore } from '../config/db.js';
import { config } from '../config/env.js';

const INDIAN_BANKS_DIRECTORY = [
  {
    id: 'sbi',
    name: 'State Bank of India',
    helpline: '18001234',
    smsFormat: 'BLOCK <Last 4 Digits of Card> to 567676',
    portalUrl: 'https://crcf.sbi.co.in',
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    helpline: '18002026161',
    smsFormat: 'BLOCK <Card Number> to 5676712',
    portalUrl: 'https://www.hdfcbank.com',
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    helpline: '18001080',
    smsFormat: 'BLOCK to 5676766',
    portalUrl: 'https://www.icicibank.com',
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    helpline: '18604195555',
    smsFormat: 'BLOCK to 5676782',
    portalUrl: 'https://www.axisbank.com',
  },
  {
    id: 'pnb',
    name: 'Punjab National Bank',
    helpline: '18001802222',
    smsFormat: 'HOT <16-digit Card> to 5607040',
    portalUrl: 'https://pnbindia.in',
  },
];

export const incidentController = {
  async reportIncident(req, res) {
    const { incidentType, financialLossInr, bankName, transactionRefRrn, notes, sessionId } = req.body;
    const userId = req.user?.id || 'guest';

    const incidentId = `inc_${Date.now()}`;
    const record = {
      incidentId,
      userId,
      sessionId: sessionId || null,
      incidentType,
      financialLossInr: financialLossInr || 0,
      bankName: bankName || 'Bank',
      transactionRefRrn: transactionRefRrn || 'N/A',
      status: 'REPORTED',
      reportedAt: new Date().toISOString(),
    };

    memoryStore.incidents.set(incidentId, record);

    res.status(201).json({
      success: true,
      data: {
        incidentId,
        legalDisclaimer:
          'IMPORTANT NOTICE: FraudShield is an educational and defensive advisory platform. FraudShield CANNOT freeze your bank account, recall UPI transfers, or recover funds. You must immediately call 1930 and contact your bank directly.',
        cybercrimeComplaintDraft: {
          portalUrl: config.portalUrl,
          helpline: config.helpline,
          prefilledSummary: `Unauthorized ${incidentType} of INR ${financialLossInr} reported. Bank: ${bankName}. Reference UTR/RRN: ${transactionRefRrn}. Notes: ${notes || 'None'}.`,
        },
        chakshuGuidance: {
          portalUrl: 'https://sancharsaathi.gov.in/sfc/',
          instruction: 'Report suspected fraud SMS headers and mobile numbers to the Department of Telecommunications on the Chakshu portal.',
        },
        bankEmergencyActions: {
          bankName,
          instruction: 'Call the official bank fraud number immediately to freeze net banking and ATM cards.',
        },
      },
    });
  },

  getBankHotlines(req, res) {
    res.json({
      success: true,
      data: {
        banks: INDIAN_BANKS_DIRECTORY,
        nationalHelpline: config.helpline,
        cybercrimePortal: config.portalUrl,
      },
    });
  },
};
