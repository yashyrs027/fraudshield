from typing import List, Dict, Any, Tuple
from datetime import datetime
from app.models.schemas import (
    RiskLevel,
    ThreatSeverity,
    ThreatIndicator,
    FactorContribution,
    UnifiedAnalysisResponse
)

# Severity Weight Configuration
SEVERITY_WEIGHT_MAP = {
    ThreatSeverity.CRITICAL: 35,
    ThreatSeverity.HIGH: 20,
    ThreatSeverity.MEDIUM: 10,
    ThreatSeverity.LOW: 5,
    ThreatSeverity.INFO: 0
}

class UnifiedRiskEngine:
    @staticmethod
    def calculate_composite_score(indicators: List[ThreatIndicator]) -> Tuple[int, RiskLevel, List[FactorContribution]]:
        """
        Deduplicates related signals, calculates weighted contribution scores,
        and assigns categorical Risk Levels without arbitrary percentages.
        """
        seen_codes = set()
        unique_indicators: List[ThreatIndicator] = []
        
        # Deduplication to avoid double-counting signals
        for ind in indicators:
            if ind.code not in seen_codes:
                seen_codes.add(ind.code)
                unique_indicators.append(ind)

        # Baseline score calculation
        raw_score = 0
        urgency_points = 0
        identity_points = 0
        channel_points = 0
        mechanics_points = 0

        for ind in unique_indicators:
            pts = SEVERITY_WEIGHT_MAP.get(ind.severity, 0)
            raw_score += pts
            
            # Factor mapping
            if "URGENCY" in ind.code or "COERCION" in ind.code:
                urgency_points += pts
            elif "BRAND" in ind.code or "IMPERSONATION" in ind.code or "VPA" in ind.code:
                identity_points += pts
            elif "URL" in ind.code or "SHORT" in ind.code or "HTTP" in ind.code or "SSRF" in ind.code:
                channel_points += pts
            elif "COLLECT" in ind.code or "DEBIT" in ind.code or "APK" in ind.code:
                mechanics_points += pts

        # Clamping score 0 to 100
        composite_score = min(100, raw_score)

        # Categorical Assignment based on approved thresholds
        if composite_score >= 85 or any(ind.severity == ThreatSeverity.CRITICAL for ind in unique_indicators):
            risk_level = RiskLevel.CRITICAL
            composite_score = max(composite_score, 88)
        elif composite_score >= 65 or any(ind.severity == ThreatSeverity.HIGH for ind in unique_indicators):
            risk_level = RiskLevel.HIGH
            composite_score = max(composite_score, 70)
        elif composite_score >= 30:
            risk_level = RiskLevel.MEDIUM
        else:
            risk_level = RiskLevel.LOW
            composite_score = min(composite_score, 25)

        # Factor contributions for transparent UI explainability
        factor_contributions = [
            FactorContribution(factor="Linguistic Urgency & Coercion", weight=25, score=min(100, urgency_points * 2)),
            FactorContribution(factor="Identity & Sender Verification", weight=25, score=min(100, identity_points * 2)),
            FactorContribution(factor="Link & Web Channel Safety", weight=25, score=min(100, channel_points * 2)),
            FactorContribution(factor="Payment Mechanics & Payload", weight=25, score=min(100, mechanics_points * 2)),
        ]

        return composite_score, risk_level, factor_contributions

    @staticmethod
    def generate_plain_language_verdict(
        risk_level: RiskLevel,
        scam_category: str,
        indicators: List[ThreatIndicator]
    ) -> Tuple[str, List[str]]:
        """
        Generates 3-part evidence-based plain language advice:
        1. What was found
        2. Why it is risky
        3. What you should do right now
        """
        advice = []
        if risk_level in [RiskLevel.CRITICAL, RiskLevel.HIGH]:
            if "ELECTRICITY" in scam_category:
                verdict = "Critical Danger: Deceptive Electricity Disconnection Phishing Scam"
                advice = [
                    "DO NOT call the mobile number or click the link. Electricity departments never send personal 10-digit mobile numbers for bill payments.",
                    "Verify pending dues only through your official electricity distribution company portal or power app.",
                    "State power boards never cut electricity within 2 hours of sending an unsolicited SMS."
                ]
            elif "KYC" in scam_category or "BANK" in scam_category:
                verdict = "High Danger: Banking Suspension Phishing Scam"
                advice = [
                    "DO NOT enter your internet banking username, password, or OTP on the provided link.",
                    "Banks never require KYC or PAN updates through third-party websites or SMS links.",
                    "Access official banking services only via your bank's verified mobile app or registered domain."
                ]
            elif "REVERSE_COLLECT" in scam_category:
                verdict = "Critical Danger: Deceptive UPI Collect / Debit Request Disguised as Cashback"
                advice = [
                    "DO NOT ENTER YOUR UPI PIN. Entering your PIN will instantly DEBIT money from your bank account.",
                    "Universal Payment Rule: You NEVER need to enter a UPI PIN to receive money or cashback.",
                    "Block and report the sender's payment QR code immediately."
                ]
            elif "DIGITAL_ARREST" in scam_category:
                verdict = "Severe Danger: Digital Arrest & Law Enforcement Impersonation Extortion"
                advice = [
                    "Disconnect any active Skype, WhatsApp, or phone call immediately.",
                    "There is NO legal provision for 'Digital Arrest' under Indian law; police never interrogate or demand funds over video calls.",
                    "Call the National Cyber Helpline 1930 immediately to report the caller's phone number."
                ]
            elif any("APK" in ind.code for ind in indicators):
                verdict = "Critical Danger: Malicious Android Sideloaded APK Trojan"
                advice = [
                    "DO NOT install or open the downloaded file.",
                    "Rogue APKs request SMS permissions to intercept banking OTPs and siphon funds.",
                    "Delete the file immediately from your phone's Downloads folder."
                ]
            else:
                verdict = f"High Risk: Suspicious Deception Pattern Detected ({scam_category.replace('_', ' ')})"
                advice = [
                    "Do not click unverified links or share personal details.",
                    "Verify the request through official customer care channels.",
                    "Never enter your UPI PIN unless you intend to pay money."
                ]
        elif risk_level == RiskLevel.MEDIUM:
            verdict = "Caution Advised: Unverified Sender or Suspicious Urgency Indicators"
            advice = [
                "Proceed with caution. The communication contains unusual urgency or unverified links.",
                "Verify the sender's shortcode against official commercial registries.",
                "Do not forward the message to family members without verification."
            ]
        else:
            verdict = "Safe / Low Risk: Standard Authentic Transaction Communication"
            advice = [
                "No known malicious patterns, predatory keywords, or deceptive debit intents detected.",
                "Follow standard digital security hygiene; never share OTPs or banking PINs with anyone."
            ]

        return verdict, advice

    @classmethod
    def synthesize_unified_assessment(
        cls,
        session_id: str,
        analysis_type: str,
        scam_category: str,
        indicators: List[ThreatIndicator],
        extracted_entities: Dict[str, Any]
    ) -> UnifiedAnalysisResponse:
        composite_score, risk_level, factor_contributions = cls.calculate_composite_score(indicators)
        verdict, advice = cls.generate_plain_language_verdict(risk_level, scam_category, indicators)

        title = f"{analysis_type.replace('_', ' ').title()} - {scam_category.replace('_', ' ').title()}"

        return UnifiedAnalysisResponse(
            session_id=session_id,
            analysis_type=analysis_type,
            risk_score=composite_score,
            risk_level=risk_level,
            title=title,
            summary_verdict=verdict,
            actionable_advice=advice,
            threat_breakdown={
                "scam_category": scam_category,
                "indicators_count": len(indicators),
                "is_critical": risk_level == RiskLevel.CRITICAL
            },
            factor_contributions=factor_contributions,
            indicators=indicators,
            extracted_entities=extracted_entities,
            evaluated_at=datetime.utcnow().isoformat() + "Z"
        )
