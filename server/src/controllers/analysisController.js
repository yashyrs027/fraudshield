import { aiServiceClient } from '../services/aiServiceClient.js';
import { redactPII } from '../services/piiRedactor.js';
import { memoryStore } from '../config/db.js';

export const analysisController = {
  async analyzeMessage(req, res, next) {
    try {
      const { content, senderHeader, consentGranted } = req.body;
      const fileBuffer = req.file?.buffer;

      // Mandatory PII Redaction
      const sanitizedContent = redactPII(content || '');

      const assessment = await aiServiceClient.analyzeMessage(sanitizedContent, senderHeader);

      // Persist session
      const sessionId = assessment.session_id || `sess_${Date.now()}`;
      const sessionRecord = {
        sessionId,
        userId: req.user?.id || null,
        inputType: 'TEXT_MESSAGE',
        assessment,
        createdAt: new Date().toISOString(),
      };

      memoryStore.sessions.set(sessionId, sessionRecord);
      memoryStore.assessments.set(sessionId, assessment);

      res.status(200).json({
        success: true,
        data: {
          sessionId,
          analysisType: 'TEXT_MESSAGE',
          riskScore: assessment.risk_score,
          riskLevel: assessment.risk_level,
          title: assessment.title,
          summaryVerdict: assessment.summary_verdict,
          actionableAdvice: assessment.actionable_advice,
          threatBreakdown: assessment.threat_breakdown,
          factorContributions: assessment.factor_contributions,
          indicators: assessment.indicators,
          extractedEntities: assessment.extracted_entities,
          evaluatedAt: assessment.evaluated_at,
        },
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  },

  async analyzeQr(req, res, next) {
    try {
      const { qrPayload } = req.body;
      const fileBuffer = req.file?.buffer;

      const assessment = await aiServiceClient.analyzeQr(qrPayload, fileBuffer);

      const sessionId = assessment.session_id || `sess_${Date.now()}`;
      const sessionRecord = {
        sessionId,
        userId: req.user?.id || null,
        inputType: 'QR_IMAGE',
        assessment,
        createdAt: new Date().toISOString(),
      };

      memoryStore.sessions.set(sessionId, sessionRecord);
      memoryStore.assessments.set(sessionId, assessment);

      res.status(200).json({
        success: true,
        data: {
          sessionId,
          analysisType: 'QR_IMAGE',
          riskScore: assessment.risk_score,
          riskLevel: assessment.risk_level,
          title: assessment.title,
          summaryVerdict: assessment.summary_verdict,
          actionableAdvice: assessment.actionable_advice,
          threatBreakdown: assessment.threat_breakdown,
          factorContributions: assessment.factor_contributions,
          indicators: assessment.indicators,
          extractedEntities: assessment.extracted_entities,
          evaluatedAt: assessment.evaluated_at,
        },
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  },

  async analyzeUrl(req, res, next) {
    try {
      const { url } = req.body;
      const assessment = await aiServiceClient.analyzeUrl(url);

      const sessionId = assessment.session_id || `sess_${Date.now()}`;
      const sessionRecord = {
        sessionId,
        userId: req.user?.id || null,
        inputType: 'URL',
        assessment,
        createdAt: new Date().toISOString(),
      };

      memoryStore.sessions.set(sessionId, sessionRecord);
      memoryStore.assessments.set(sessionId, assessment);

      res.status(200).json({
        success: true,
        data: {
          sessionId,
          analysisType: 'URL',
          riskScore: assessment.risk_score,
          riskLevel: assessment.risk_level,
          title: assessment.title,
          summaryVerdict: assessment.summary_verdict,
          actionableAdvice: assessment.actionable_advice,
          threatBreakdown: assessment.threat_breakdown,
          factorContributions: assessment.factor_contributions,
          indicators: assessment.indicators,
          extractedEntities: assessment.extracted_entities,
          evaluatedAt: assessment.evaluated_at,
        },
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  },

  async getAssessmentById(req, res, next) {
    try {
      const { sessionId } = req.params;
      const assessment = memoryStore.assessments.get(sessionId);

      if (!assessment) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Analysis record not found or has expired from retention cache.',
          },
        });
      }

      res.json({
        success: true,
        data: {
          sessionId,
          riskScore: assessment.risk_score,
          riskLevel: assessment.risk_level,
          title: assessment.title,
          summaryVerdict: assessment.summary_verdict,
          actionableAdvice: assessment.actionable_advice,
          threatBreakdown: assessment.threat_breakdown,
          factorContributions: assessment.factor_contributions,
          indicators: assessment.indicators,
          extractedEntities: assessment.extracted_entities,
          evaluatedAt: assessment.evaluated_at,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async getHistory(req, res) {
    const items = [];
    const userId = req.user?.id;

    for (const s of memoryStore.sessions.values()) {
      if (!userId || s.userId === userId || s.userId === null) {
        items.push({
          sessionId: s.sessionId,
          inputType: s.inputType,
          title: s.assessment?.title || 'Scan Record',
          scamCategory: s.assessment?.threat_breakdown?.scam_category || 'SCAM',
          riskScore: s.assessment?.risk_score || 0,
          riskLevel: s.assessment?.risk_level || 'LOW',
          createdAt: s.createdAt,
          summary: s.assessment?.summary_verdict || '',
        });
      }
    }

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalRecords: items.length,
        },
      },
    });
  },
};
