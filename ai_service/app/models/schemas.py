from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ThreatSeverity(str, Enum):
    INFO = "INFO"
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ThreatIndicator(BaseModel):
    id: str = Field(..., description="Unique identifier for the indicator rule")
    code: str = Field(..., description="Machine-readable rule code")
    severity: ThreatSeverity
    title: str
    description: str
    weight: float = 1.0

class FactorContribution(BaseModel):
    factor: str
    weight: int
    score: int

class ExtractedEntities(BaseModel):
    sender_header: Optional[str] = None
    phone_numbers: List[str] = []
    urls: List[str] = []
    vpa_handles: List[str] = []
    amounts: List[str] = []
    deadlines: List[str] = []
    targeted_institutions: List[str] = []

# Request & Response Schemas for Message Analysis
class MessageAnalysisRequest(BaseModel):
    content: str = Field(..., min_length=5, max_length=10000, description="SMS or message text")
    sender_header: Optional[str] = Field(None, description="Sender header e.g. VM-POWERT, AD-SBINB")
    consent_granted: bool = True

class MessageAnalysisResponse(BaseModel):
    scam_category: str
    detected_language: str
    urgency_score: float
    coercion_detected: bool
    impersonation_target: Optional[str] = None
    extracted_entities: ExtractedEntities
    indicators: List[ThreatIndicator]
    confidence_score: float

# Request & Response Schemas for QR Analysis
class QrAnalysisRequest(BaseModel):
    qr_payload: Optional[str] = None
    consent_granted: bool = True

class UpiPayload(BaseModel):
    is_upi: bool
    vpa: Optional[str] = None
    payee_name: Optional[str] = None
    merchant_code: Optional[str] = None
    amount: Optional[str] = None
    currency: Optional[str] = "INR"
    transaction_note: Optional[str] = None
    is_collect_request: bool = False
    is_debit_intent: bool = False

class QrAnalysisResponse(BaseModel):
    raw_payload: str
    upi_payload: UpiPayload
    indicators: List[ThreatIndicator]
    warning_flag: Optional[str] = None
    confidence_score: float

# Request & Response Schemas for URL Analysis
class UrlAnalysisRequest(BaseModel):
    url: str = Field(..., description="Target URL to inspect")
    consent_granted: bool = True

class UrlAnalysisResponse(BaseModel):
    original_url: str
    resolved_destination_url: str
    redirect_hops: int
    domain_name: str
    domain_age_days: Optional[int] = None
    is_typosquatting: bool = False
    targeted_brand: Optional[str] = None
    similarity_score: float = 0.0
    has_ssl: bool = False
    contains_direct_apk: bool = False
    indicators: List[ThreatIndicator]
    confidence_score: float

# Unified Risk Assessment
class UnifiedAnalysisResponse(BaseModel):
    session_id: str
    analysis_type: str
    risk_score: int
    risk_level: RiskLevel
    title: str
    summary_verdict: str
    actionable_advice: List[str]
    threat_breakdown: Dict[str, Any]
    factor_contributions: List[FactorContribution]
    indicators: List[ThreatIndicator]
    extracted_entities: Dict[str, Any]
    evaluated_at: str
