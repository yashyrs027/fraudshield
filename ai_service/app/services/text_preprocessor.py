import re
import unicodedata
from typing import Dict, List, Any

# Indian Bank & Telecom Header Regex
HEADER_REGEX = re.compile(r'\b[A-Za-z]{2}-([A-Za-z0-9]{3,8})\b')

# Indian Mobile Number Regex (10 digits starting with 6, 7, 8, or 9, optional +91 prefix)
PHONE_REGEX = re.compile(r'(?:\+91[\-\s]?)?[6-9]\d{9}\b')

# Web Links & URL Regex
URL_REGEX = re.compile(r'(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*|bit\.ly\/[A-Za-z0-9\-_]+|tinyurl\.com\/[A-Za-z0-9\-_]+|t\.co\/[A-Za-z0-9\-_]+', re.IGNORECASE)

# UPI Virtual Payment Address (VPA) Regex
VPA_REGEX = re.compile(r'[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}')

# Currency & Financial Amounts Regex
AMOUNT_REGEX = re.compile(r'(?:(?:Rs\.?|INR|₹)\s*[\d,]+(?:\.\d{2})?|[\d,]+(?:\.\d{2})?\s*(?:rupees|INR))', re.IGNORECASE)

# Urgency and Deadline Expressions
DEADLINE_REGEX = re.compile(r'\b(?:within \d+ hours?|tonight at \d+(?::\d+)?\s*(?:pm|am)?|today itself|immediately|before 9:?30 pm|urgent|aaj raat|turant)\b', re.IGNORECASE)

# Known Indian Institutions for Impersonation Identification
TARGETED_INSTITUTIONS_MAP = {
    "SBI": ["sbi", "state bank", "yono"],
    "HDFC": ["hdfc", "hdfc bank", "netbanking"],
    "ICICI": ["icici", "imobile", "icici bank"],
    "PNB": ["pnb", "punjab national bank"],
    "AXIS": ["axis", "axis bank"],
    "PAYTM": ["paytm", "paytm payments bank"],
    "PHONEPE": ["phonepe"],
    "GPAY": ["gpay", "google pay"],
    "ELECTRICITY_BOARD": ["electricity", "power station", "bijli", "discom", "power bill", "bescom", "uppcl", "tneb", "msedcl", "tpdsl", "cesc"],
    "POLICE_CBI": ["police", "cbi", "cyber crime", "customs", "digital arrest", "narcotics", "mumbai police", "delhi police", "ed", "enforcement directorate"],
    "INDIA_POST": ["india post", "speed post", "courier", "postal package", "delivery address incomplete"],
}

class TextPreprocessor:
    @staticmethod
    def normalize_text(text: str) -> str:
        if not text:
            return ""
        # Unicode NFKD normalization to remove homoglyphs and hidden characters
        normalized = unicodedata.normalize('NFKD', text)
        # Remove zero-width spaces and control chars
        normalized = "".join(ch for ch in normalized if unicodedata.category(ch)[0] != 'C' or ch in '\n\r\t')
        return normalized.strip()

    @staticmethod
    def detect_language(text: str) -> str:
        """
        Determines whether text is Devanagari (Hindi), Latin (English), or Hinglish (mixed romanized Hindi).
        """
        if not text:
            return "en"
        
        devanagari_chars = sum(1 for ch in text if '\u0900' <= ch <= '\u097F')
        total_letters = sum(1 for ch in text if ch.isalpha())
        
        if total_letters == 0:
            return "en"
        
        devanagari_ratio = devanagari_chars / total_letters
        if devanagari_ratio > 0.4:
            return "hi" # Pure Hindi
            
        # Check for common Hinglish words
        hinglish_tokens = {"aaj", "raat", "bijli", "kaat", "turant", "sampark", "karein", "kijiye", "khata", "band", "shuru", "adhikari"}
        tokens = set(re.findall(r'\b[a-zA-Z]{3,}\b', text.lower()))
        if len(tokens.intersection(hinglish_tokens)) >= 2:
            return "hinglish"
            
        return "en"

    @classmethod
    def extract_entities(cls, text: str, sender_header: str = None) -> Dict[str, Any]:
        normalized = cls.normalize_text(text)
        
        # Phone numbers
        raw_phones = PHONE_REGEX.findall(normalized)
        cleaned_phones = [re.sub(r'[\-\s]', '', p) for p in raw_phones]
        
        # URLs
        raw_urls = URL_REGEX.findall(normalized)
        cleaned_urls = [u.rstrip('.,;:') for u in raw_urls]
        
        # VPAs
        raw_vpas = VPA_REGEX.findall(normalized)
        
        # Amounts
        amounts = AMOUNT_REGEX.findall(normalized)
        
        # Deadlines
        deadlines = DEADLINE_REGEX.findall(normalized)
        
        # Institution mapping
        found_institutions = []
        lower_text = normalized.lower()
        for inst, keywords in TARGETED_INSTITUTIONS_MAP.items():
            if any(kw in lower_text for kw in keywords):
                found_institutions.append(inst)
                
        # Header check
        header = sender_header
        if not header:
            header_match = HEADER_REGEX.search(text)
            if header_match:
                header = header_match.group(0)
                
        return {
            "sender_header": header,
            "phone_numbers": list(set(cleaned_phones)),
            "urls": list(set(cleaned_urls)),
            "vpa_handles": list(set(raw_vpas)),
            "amounts": amounts,
            "deadlines": deadlines,
            "targeted_institutions": found_institutions,
            "normalized_content": normalized
        }
