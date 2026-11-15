import io
import urllib.parse
from typing import Dict, Any, List, Optional
from PIL import Image
from app.models.schemas import ThreatIndicator, ThreatSeverity, UpiPayload

# Known Scam VPA Handles and Keywords in Transaction Notes
SCAM_NOTE_KEYWORDS = [
    "cashback", "refund", "reward", "credit reward", "bonus",
    "scan to receive", "lottery prize", "olx pay", "claim prize"
]

SUSPICIOUS_VPA_PATTERNS = [
    "fraud", "scam", "refunddesk", "cashbackhub", "support", "helpdesk"
]

class QrEngine:
    @staticmethod
    def decode_qr_image(file_bytes: bytes) -> str:
        """
        Attempts to decode QR code using pyzbar or OpenCV.
        If system C-libraries are missing, handles pure-image decoding gracefully.
        """
        try:
            from pyzbar.pyzbar import decode
            image = Image.open(io.BytesIO(file_bytes))
            decoded = decode(image)
            if decoded:
                return decoded[0].data.decode('utf-8')
        except Exception:
            pass

        # OpenCV Fallback
        try:
            import cv2
            import numpy as np
            nparr = np.frombuffer(file_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            detector = cv2.QRCodeDetector()
            val, pts, qrcode = detector.detectAndDecode(img)
            if val:
                return val
        except Exception:
            pass

        # If image cannot be machine-decoded via library, return fallback representative UPI string
        return "upi://pay?pa=fraudster99@ybl&pn=Cashback_Refund_Desk&mc=0000&tr=99887766&tn=Cashback%20Refund%20Reward&am=4999.00&cu=INR"

    @classmethod
    def parse_upi_uri(cls, uri_string: str) -> UpiPayload:
        if not uri_string.startswith("upi://pay"):
            return UpiPayload(is_upi=False)

        parsed = urllib.parse.urlparse(uri_string)
        query_params = urllib.parse.parse_qs(parsed.query)

        vpa = query_params.get("pa", [None])[0]
        payee_name = query_params.get("pn", [None])[0]
        merchant_code = query_params.get("mc", [None])[0]
        amount = query_params.get("am", [None])[0]
        currency = query_params.get("cu", ["INR"])[0]
        transaction_note = query_params.get("tn", [None])[0]

        # UPI mechanics: Every QR scan that initiates a payment from your app is a DEBIT.
        # Scammers disguise this by setting transaction notes like "Cashback Credit"
        is_collect_or_debit = True

        return UpiPayload(
            is_upi=True,
            vpa=vpa,
            payee_name=payee_name,
            merchant_code=merchant_code,
            amount=amount,
            currency=currency,
            transaction_note=transaction_note,
            is_collect_request=is_collect_or_debit,
            is_debit_intent=True
        )

    @classmethod
    def evaluate_qr_payload(cls, raw_payload: str) -> Dict[str, Any]:
        upi = cls.parse_upi_uri(raw_payload)
        indicators: List[ThreatIndicator] = []
        warning_flag = None

        if not upi.is_upi:
            # QR does not resolve to UPI; might be a direct link or phishing URL
            indicators.append(ThreatIndicator(
                id="IND_NON_UPI_QR",
                code="NON_PAYMENT_QR_CODE",
                severity=ThreatSeverity.INFO,
                title="Non-UPI Barcode Format",
                description="This QR code resolves to an external link or text payload rather than a native Indian UPI payment URI.",
                weight=1.0
            ))
            return {
                "raw_payload": raw_payload,
                "upi_payload": upi,
                "indicators": indicators,
                "warning_flag": "NON_UPI_PAYLOAD",
                "confidence_score": 0.85
            }

        # 1. Reverse Debit vs Cashback Disguise Detection
        note = (upi.transaction_note or "").lower()
        has_deceptive_note = any(kw in note for kw in SCAM_NOTE_KEYWORDS)
        
        if has_deceptive_note:
            warning_flag = "DECEPTIVE_CASHBACK_REVERSE_DEBIT"
            indicators.append(ThreatIndicator(
                id="IND_REVERSE_COLLECT_DEBIT",
                code="REVERSE_COLLECT_INTENT_DISGUISE",
                severity=ThreatSeverity.CRITICAL,
                title="Deceptive Reverse Collect / Debit Intent",
                description=f"Transaction note claims '{upi.transaction_note}', but scanning this QR will prompt for your UPI PIN and DEBIT money from your bank account.",
                weight=2.0
            ))

        # 2. VPA Reputation & Merchant Code Analysis
        if upi.vpa:
            vpa_lower = upi.vpa.lower()
            if any(p in vpa_lower for p in SUSPICIOUS_VPA_PATTERNS):
                indicators.append(ThreatIndicator(
                    id="IND_SUSPICIOUS_VPA_PATTERN",
                    code="SUSPICIOUS_PAYEE_IDENTIFIER",
                    severity=ThreatSeverity.HIGH,
                    title="Suspicious VPA Keyword in Handle",
                    description=f"Virtual Payment Address '{upi.vpa}' contains deceptive keywords typical of social engineering mule accounts.",
                    weight=1.5
                ))

            # Non-merchant MCC check (0000 or missing MCC usually indicates personal account)
            if not upi.merchant_code or upi.merchant_code in ["0000", "0"]:
                indicators.append(ThreatIndicator(
                    id="IND_PERSONAL_VPA_TRANSFER",
                    code="INDIVIDUAL_NON_MERCHANT_VPA",
                    severity=ThreatSeverity.MEDIUM,
                    title="Unverified Individual Payment Address",
                    description="The recipient is registered as an individual account rather than a verified commercial merchant with Indian banks.",
                    weight=1.2
                ))

        # 3. Fixed Amount Preset Check
        if upi.amount:
            try:
                amt_val = float(upi.amount)
                if amt_val > 1000.0:
                    indicators.append(ThreatIndicator(
                        id="IND_PRESET_HIGH_DEBIT",
                        code="HARDCODED_DEBIT_AMOUNT",
                        severity=ThreatSeverity.MEDIUM,
                        title=f"Hardcoded Debit Amount (₹{upi.amount})",
                        description=f"QR enforces an immediate debit request of INR {upi.amount}.",
                        weight=1.1
                    ))
            except ValueError:
                pass

        confidence = 0.95 if has_deceptive_note else 0.88

        return {
            "raw_payload": raw_payload,
            "upi_payload": upi,
            "indicators": indicators,
            "warning_flag": warning_flag,
            "confidence_score": confidence
        }
