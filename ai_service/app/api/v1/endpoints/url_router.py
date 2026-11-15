from fastapi import APIRouter, HTTPException
from app.models.schemas import UrlAnalysisRequest, UnifiedAnalysisResponse
from app.services.url_inspector import UrlInspector
from app.services.risk_engine import UnifiedRiskEngine
import uuid

router = APIRouter(prefix="/url", tags=["URL & Domain Safety Inspector"])

@router.post("/inspect", response_model=UnifiedAnalysisResponse)
async def inspect_url_endpoint(payload: UrlAnalysisRequest):
    try:
        url_res = UrlInspector.evaluate_url(payload.url)
        session_id = f"sess_{uuid.uuid4().hex[:12]}"
        
        scam_category = "BANK_IMPERSONATION" if url_res["is_typosquatting"] else (
            "MALICIOUS_APK_DOWNLOAD" if url_res["contains_direct_apk"] else "GENERAL_WEB_CHECK"
        )
        
        entities = {
            "domain_name": url_res["domain_name"],
            "domain_age_days": url_res["domain_age_days"],
            "targeted_brand": url_res["targeted_brand"],
            "similarity_score": url_res["similarity_score"],
            "has_ssl": url_res["has_ssl"],
            "contains_direct_apk": url_res["contains_direct_apk"],
            "original_url": url_res["original_url"]
        }
        
        unified = UnifiedRiskEngine.synthesize_unified_assessment(
            session_id=session_id,
            analysis_type="URL",
            scam_category=scam_category,
            indicators=url_res["indicators"],
            extracted_entities=entities
        )
        return unified
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL inspection error: {str(e)}")
