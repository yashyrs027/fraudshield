/**
 * Deterministic Fallback Rule Engine
 * Activates if Python FastAPI microservice experiences transient failure or timeout.
 */

export const FallbackRuleEngine = {
  evaluateMessage(content, senderHeader) {
    const textLower = (content || '').toLowerCase();
    const sessionId = `fallback_${Date.now()}`;
    const indicators = [];

    let riskScore = 15;
    let riskLevel = 'LOW';
    let scamCategory = 'SAFE_MESSAGE';
    let summaryVerdict = 'No malicious patterns detected by fallback heuristic scanner.';
    let advice = ['Follow standard security hygiene. Never share your UPI PIN or banking passwords.'];

    // 1. Electricity scam check
    if (
      textLower.includes('electricity') ||
      textLower.includes('power cut') ||
      textLower.includes('power station') ||
      textLower.includes('bijli')
    ) {
      if (textLower.includes('disconnect') || textLower.includes('tonight') || textLower.includes('officer')) {
        riskScore = 92;
        riskLevel = 'CRITICAL';
        scamCategory = 'ELECTRICITY_BILL_SCAM';
        summaryVerdict = 'Critical Danger: Deceptive Electricity Disconnection Phishing Scam';
        advice = [
          'DO NOT call the mobile number or click the link. Electricity boards never dispatch 10-digit mobile numbers for bill payments.',
          'Verify pending dues only on your official state power discom website or mobile app.',
          'Power departments never disconnect electricity within 2 hours of sending an unsolicited SMS.',
        ];
        indicators.push({
          id: 'IND_FALLBACK_ELECTRICITY',
          code: 'URGENCY_ARTIFICIAL_DEADLINE',
          severity: 'CRITICAL',
          title: 'Immediate Disconnection Threat',
          description: 'Demands payment under immediate threat of electricity disconnection.',
        });
      }
    }

    // 2. Bank KYC check
    else if (
      textLower.includes('kyc') ||
      textLower.includes('yono') ||
      textLower.includes('pan card') ||
      textLower.includes('netbanking suspended')
    ) {
      riskScore = 94;
      riskLevel = 'CRITICAL';
      scamCategory = 'BANK_KYC_SUSPENSION';
      summaryVerdict = 'High Danger: Banking Suspension Phishing Scam';
      advice = [
        'DO NOT enter your internet banking credentials or OTP on unverified links.',
        'Banks never ask for KYC or PAN updates via third-party SMS links.',
        'Access banking services exclusively through your verified mobile banking app.',
      ];
      indicators.push({
        id: 'IND_FALLBACK_KYC',
        code: 'BANK_SMS_UNVERIFIED_PORTAL',
        severity: 'CRITICAL',
        title: 'Bank Suspension Deception',
        description: 'Threatens account freeze to trick user into entering credentials on a phishing portal.',
      });
    }

    // 3. Reverse collect check
    else if (
      textLower.includes('cashback') ||
      textLower.includes('refund') ||
      textLower.includes('enter pin to receive')
    ) {
      riskScore = 88;
      riskLevel = 'HIGH';
      scamCategory = 'REVERSE_UPI_COLLECT';
      summaryVerdict = 'Critical Danger: Deceptive UPI Collect / Debit Disguised as Cashback';
      advice = [
        'DO NOT ENTER YOUR UPI PIN. Entering your PIN will instantly DEBIT money from your bank account.',
        'Universal Payment Rule: You NEVER enter a UPI PIN to receive money or cashback.',
        'Report and block the payment QR code or sender.',
      ];
      indicators.push({
        id: 'IND_FALLBACK_REVERSE_COLLECT',
        code: 'REVERSE_COLLECT_INTENT_DISGUISE',
        severity: 'CRITICAL',
        title: 'Reverse Collect / Debit Masquerade',
        description: 'Payment prompt executes a debit while promising cashback or a refund.',
      });
    }

    return {
      session_id: sessionId,
      analysis_type: 'TEXT_MESSAGE',
      risk_score: riskScore,
      risk_level: riskLevel,
      title: `Heuristic Analysis - ${scamCategory.replace(/_/g, ' ')}`,
      summary_verdict: summaryVerdict,
      actionable_advice: advice,
      threat_breakdown: {
        scam_category: scamCategory,
        mode: 'DETERMINISTIC_FALLBACK_ENGINE',
      },
      factor_contributions: [
        { factor: 'Linguistic Urgency', weight: 30, score: riskScore > 50 ? 90 : 10 },
        { factor: 'Sender Verification', weight: 25, score: riskScore > 50 ? 80 : 10 },
        { factor: 'Link Safety', weight: 25, score: riskScore > 50 ? 85 : 0 },
        { factor: 'Payment Mechanics', weight: 20, score: riskScore > 50 ? 90 : 0 },
      ],
      indicators,
      extracted_entities: {
        sender_header: senderHeader || 'UNKNOWN',
        normalized_content: content,
      },
      evaluated_at: new Date().toISOString(),
    };
  },

  evaluateQr(rawPayload) {
    const isUpi = (rawPayload || '').startsWith('upi://pay');
    const sessionId = `fallback_qr_${Date.now()}`;
    const payloadLower = (rawPayload || '').toLowerCase();

    const isDeceptive =
      payloadLower.includes('cashback') ||
      payloadLower.includes('refund') ||
      payloadLower.includes('reward');

    const riskScore = isDeceptive ? 88 : 20;
    const riskLevel = isDeceptive ? 'HIGH' : 'LOW';

    return {
      session_id: sessionId,
      analysis_type: 'QR_IMAGE',
      risk_score: riskScore,
      risk_level: riskLevel,
      title: isDeceptive ? 'Deceptive UPI Collect QR' : 'Standard UPI QR Code',
      summary_verdict: isDeceptive
        ? 'Critical Danger: Deceptive UPI Collect / Debit Disguised as Cashback'
        : 'Standard UPI Payment QR Code',
      actionable_advice: isDeceptive
        ? [
            'DO NOT ENTER YOUR UPI PIN. Entering a PIN always debits funds.',
            'You never need a PIN to receive a refund or cashback.',
          ]
        : ['Verify recipient payee name before authorizing transaction.'],
      threat_breakdown: {
        is_upi: isUpi,
        mode: 'DETERMINISTIC_FALLBACK_ENGINE',
      },
      factor_contributions: [
        { factor: 'Debit Intent', weight: 40, score: isDeceptive ? 95 : 10 },
        { factor: 'Transaction Note', weight: 30, score: isDeceptive ? 90 : 10 },
        { factor: 'VPA Handle', weight: 30, score: isDeceptive ? 80 : 10 },
      ],
      indicators: isDeceptive
        ? [
            {
              id: 'IND_FALLBACK_REVERSE_COLLECT',
              code: 'REVERSE_COLLECT_INTENT_DISGUISE',
              severity: 'CRITICAL',
              title: 'Debit Masquerading as Cashback',
              description: 'Transaction note claims reward while payload executes a debit.',
            },
          ]
        : [],
      extracted_entities: {
        raw_payload: rawPayload,
      },
      evaluated_at: new Date().toISOString(),
    };
  },

  evaluateUrl(url) {
    const urlLower = (url || '').toLowerCase();
    const sessionId = `fallback_url_${Date.now()}`;

    const isTyposquat =
      urlLower.includes('sbi-') ||
      urlLower.includes('-sbi') ||
      urlLower.includes('sbi-kyc') ||
      urlLower.includes('hdfc-') ||
      urlLower.includes('pan-verify');

    const isApk = urlLower.endsWith('.apk') || urlLower.includes('.apk?');
    const isShort = urlLower.includes('bit.ly') || urlLower.includes('tinyurl');

    let riskScore = 15;
    let riskLevel = 'LOW';
    let summaryVerdict = 'Standard Web Link';

    if (isTyposquat) {
      riskScore = 96;
      riskLevel = 'CRITICAL';
      summaryVerdict = 'Critical Danger: Typosquatted Bank Phishing Domain';
    } else if (isApk) {
      riskScore = 92;
      riskLevel = 'CRITICAL';
      summaryVerdict = 'Critical Danger: Malicious Android Sideloaded APK';
    } else if (isShort) {
      riskScore = 60;
      riskLevel = 'MEDIUM';
      summaryVerdict = 'Caution: Obfuscated URL Shortener Link';
    }

    return {
      session_id: sessionId,
      analysis_type: 'URL',
      risk_score: riskScore,
      risk_level: riskLevel,
      title: `URL Safety Check - ${summaryVerdict}`,
      summary_verdict: summaryVerdict,
      actionable_advice:
        riskScore > 70
          ? ['DO NOT enter banking credentials on this link.', 'Close the page immediately.']
          : ['Exercise caution when visiting unverified web links.'],
      threat_breakdown: {
        is_typosquatting: isTyposquat,
        contains_apk: isApk,
        mode: 'DETERMINISTIC_FALLBACK_ENGINE',
      },
      factor_contributions: [
        { factor: 'Brand Impersonation', weight: 40, score: isTyposquat ? 98 : 0 },
        { factor: 'Executable Download', weight: 30, score: isApk ? 95 : 0 },
        { factor: 'URL Obfuscation', weight: 30, score: isShort ? 80 : 0 },
      ],
      indicators: isTyposquat
        ? [
            {
              id: 'IND_FALLBACK_TYPO',
              code: 'DOMAIN_BRAND_IMPERSONATION',
              severity: 'CRITICAL',
              title: 'Bank Brand Typosquatting',
              description: 'Domain incorporates banking brand keywords to trick victims.',
            },
          ]
        : [],
      extracted_entities: {
        url,
      },
      evaluated_at: new Date().toISOString(),
    };
  },
};
