import re
from typing import Dict, List, Any, Tuple
from app.models.schemas import ThreatIndicator, ThreatSeverity
from app.services.text_preprocessor import TextPreprocessor

# High-Risk Vocabulary & Grammatical Signals for Indian Cybercrime
ELECTRICITY_KEYWORDS = [
    "electricity power will be disconnected", "power cut", "power station", 
    "bill update", "bijli kaat", "disconnection tonight", "officer at",
    "electric officer", "pending electricity bill", "electricity bill",
    "electricity supply", "avoid disconnection"
]

KYC_KEYWORDS = [
    "yono account", "kyc pending", "pan card expired", "account suspended", 
    "blocked today", "debit card blocked", "update pan", "verify kyc",
    "click to unblock", "netbanking will be deactivated", "netbanking access is suspended"
]

DIGITAL_ARREST_KEYWORDS = [
    "digital arrest", "mumbai police", "cyber crime cell", "customs department",
    "narcotics parcel", "illegal drugs", "fir registered", "video call arrest",
    "warrant issued", "cbi investigation", "national security act", "customs alert"
]

REVERSE_COLLECT_KEYWORDS = [
    "cashback credit", "refund reward", "scan to receive", "enter pin to accept",
    "claim cashback", "olx advance", "buyer payment qr", "cashback reward",
    "enter your upi pin", "enter upi pin", "scan this qr"
]

LOTTERY_JOB_KEYWORDS = [
    "part time job", "youtube like and earn", "telegram task", "daily 5000",
    "lottery winner", "kbc lottery", "congratulations", "you have won",
    "work from home guaranteed", "claim prize", "processing fee"
]

LEGITIMATE_KEYWORDS = [
    "credited with inr", "debited by inr", "avl bal", "available balance",
    "neft-", "upi-", "atpos", "salary credit", "statement for account",
    "otp for your", "due date is", "bill for ca no", "temporarily locked"
]

COERCION_PATTERNS = [
    r'\b(?:arrest|warrant|fir|police|court|legal action|custody|jail|penalty)\b',
    r'\b(?:disconnect|cut off|block|terminate|freeze|suspend)\b',
    r'\b(?:immediate|within \d+ hours?|today itself|urgent|turant)\b'
]

class NlpEngine:
    @classmethod
    def analyze_message(cls, content: str, sender_header: str = None) -> Dict[str, Any]:
        entities = TextPreprocessor.extract_entities(content, sender_header)
        text_lower = entities["normalized_content"].lower()
        language = TextPreprocessor.detect_language(content)
        
        indicators: List[ThreatIndicator] = []
        scam_scores = {
            "ELECTRICITY_BILL_SCAM": 0.0,
            "BANK_KYC_SUSPENSION": 0.0,
            "DIGITAL_ARREST_EXTORTION": 0.0,
            "REVERSE_UPI_COLLECT": 0.0,
            "LOTTERY_JOB_SCAM": 0.0,
            "LEGITIMATE_TRANSACTION": 0.0,
        }

        # 1. Linguistic Pattern Matching & Intent Scoring
        for kw in ELECTRICITY_KEYWORDS:
            if kw in text_lower:
                scam_scores["ELECTRICITY_BILL_SCAM"] += 25.0

        for kw in KYC_KEYWORDS:
            if kw in text_lower:
                scam_scores["BANK_KYC_SUSPENSION"] += 25.0

        for kw in DIGITAL_ARREST_KEYWORDS:
            if kw in text_lower:
                scam_scores["DIGITAL_ARREST_EXTORTION"] += 30.0

        for kw in REVERSE_COLLECT_KEYWORDS:
            if kw in text_lower:
                scam_scores["REVERSE_UPI_COLLECT"] += 25.0

        for kw in LOTTERY_JOB_KEYWORDS:
            if kw in text_lower:
                scam_scores["LOTTERY_JOB_SCAM"] += 20.0

        for kw in LEGITIMATE_KEYWORDS:
            if kw in text_lower:
                scam_scores["LEGITIMATE_TRANSACTION"] += 25.0

        # 2. Urgency & Coercion Detection
        urgency_score = 0.0
        if entities["deadlines"]:
            urgency_score += 45.0
            indicators.append(ThreatIndicator(
                id="IND_URGENCY_DEADLINE",
                code="URGENCY_ARTIFICIAL_DEADLINE",
                severity=ThreatSeverity.CRITICAL,
                title="Artificial Immediate Deadline",
                description=f"Demands financial or procedural action within an arbitrary deadline: {', '.join(entities['deadlines'])}",
                weight=1.5
            ))
            
        coercion_hits = 0
        for pattern in COERCION_PATTERNS:
            if re.search(pattern, text_lower):
                coercion_hits += 1
                
        coercion_detected = coercion_hits >= 2
        if coercion_detected:
            urgency_score += 35.0
            indicators.append(ThreatIndicator(
                id="IND_COERCION_PRESSURE",
                code="PSYCHOLOGICAL_COERCION",
                severity=ThreatSeverity.HIGH,
                title="Coercive Threat Language",
                description="Message exploits fear of service disconnection, legal action, or police consequences to force immediate compliance.",
                weight=1.3
            ))

        urgency_score = min(100.0, urgency_score + (coercion_hits * 10.0))

        # 3. Channel & Impersonation Mismatch
        impersonation_target = None
        if "ELECTRICITY_BOARD" in entities["targeted_institutions"]:
            impersonation_target = "State Electricity Utility Board"
            if entities["phoneNumbers"] if "phoneNumbers" in entities else entities["phone_numbers"]:
                indicators.append(ThreatIndicator(
                    id="IND_PERSONAL_PHONE_DISCOM",
                    code="UNOFFICIAL_COMMUNICATION_CHANNEL",
                    severity=ThreatSeverity.CRITICAL,
                    title="Personal Mobile Number for Utility Payment",
                    description="Government electricity boards never dispatch personal 10-digit mobile numbers for bill settlement.",
                    weight=1.8
                ))
                scam_scores["ELECTRICITY_BILL_SCAM"] += 30.0

        if "SBI" in entities["targeted_institutions"] or "HDFC" in entities["targeted_institutions"] or "ICICI" in entities["targeted_institutions"]:
            impersonation_target = ", ".join([inst for inst in entities["targeted_institutions"] if inst in ["SBI", "HDFC", "ICICI", "PNB", "AXIS"]])
            if entities["urls"]:
                indicators.append(ThreatIndicator(
                    id="IND_BANK_SMS_EXTERNAL_LINK",
                    code="BANK_SMS_UNVERIFIED_PORTAL",
                    severity=ThreatSeverity.HIGH,
                    title="Bank Suspension Phishing Link",
                    description="Banks do not transmit external web links via SMS requesting online PAN/Aadhaar/KYC submission.",
                    weight=1.6
                ))
                scam_scores["BANK_KYC_SUSPENSION"] += 35.0

        # Short URL Indicator
        short_urls = [u for u in entities["urls"] if any(s in u for s in ["bit.ly", "tinyurl", "t.co", "is.gd"])]
        if short_urls:
            indicators.append(ThreatIndicator(
                id="IND_SHORT_LINK_MASKING",
                code="OBFUSCATED_SHORT_URL",
                severity=ThreatSeverity.HIGH,
                title="Obfuscated Shortened Link",
                description=f"Message masks true web destination using URL shortener: {', '.join(short_urls)}",
                weight=1.4
            ))

        # 4. Final Scam Classification Determination
        sorted_scams = sorted(scam_scores.items(), key=lambda item: item[1], reverse=True)
        top_category, top_score = sorted_scams[0]

        # Invert if legitimate score dominates and no critical indicators present
        if scam_scores["LEGITIMATE_TRANSACTION"] >= 20.0 and len(indicators) == 0:
            top_category = "LEGITIMATE_TRANSACTION"
            confidence = 0.95
        elif top_score >= 20.0:
            confidence = min(0.99, 0.65 + (top_score / 150.0))
        else:
            top_category = "UNCLASSIFIED_SUSPICIOUS" if len(indicators) > 0 else "SAFE_MESSAGE"
            confidence = 0.70

        return {
            "scam_category": top_category,
            "detected_language": language,
            "urgency_score": round(urgency_score, 1),
            "coercion_detected": coercion_detected,
            "impersonation_target": impersonation_target,
            "extracted_entities": entities,
            "indicators": indicators,
            "confidence_score": round(confidence, 2)
        }
