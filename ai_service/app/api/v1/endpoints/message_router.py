from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import MessageAnalysisRequest, MessageAnalysisResponse, UnifiedAnalysisResponse
from app.services.nlp_engine import NlpEngine
from app.services.risk_engine import UnifiedRiskEngine
import uuid

router = APIRouter(prefix="/message", tags=["Message Threat Intelligence"])

@router.post("/analyze", response_model=UnifiedAnalysisResponse)
async def analyze_message_endpoint(payload: MessageAnalysisRequest):
    try:
        nlp_res = NlpEngine.analyze_message(payload.content, payload.sender_header)
        session_id = f"sess_{uuid.uuid4().hex[:12]}"
        
        unified = UnifiedRiskEngine.synthesize_unified_assessment(
            session_id=session_id,
            analysis_type="TEXT_MESSAGE",
            scam_category=nlp_res["scam_category"],
            indicators=nlp_res["indicators"],
            extracted_entities=nlp_res["extracted_entities"]
        )
        return unified
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"NLP analysis error: {str(e)}")
