from fastapi import APIRouter, HTTPException, UploadFile, File
from app.models.schemas import UnifiedAnalysisResponse
from app.services.ocr_engine import OcrEngine
from app.services.risk_engine import UnifiedRiskEngine
import uuid

router = APIRouter(prefix="/ocr", tags=["Screenshot OCR Engine"])

@router.post("/process-screenshot", response_model=UnifiedAnalysisResponse)
async def process_screenshot_endpoint(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        ocr_res = OcrEngine.evaluate_screenshot(contents)
        session_id = f"sess_{uuid.uuid4().hex[:12]}"
        
        entities = {
            "extracted_text": ocr_res["extracted_text"],
            "image_metadata": ocr_res["image_metadata"],
            "has_valid_utr": ocr_res["has_valid_utr"],
            "detected_utrs": ocr_res["detected_utrs"]
        }
        
        unified = UnifiedRiskEngine.synthesize_unified_assessment(
            session_id=session_id,
            analysis_type="PAYMENT_SCREENSHOT",
            scam_category=ocr_res["scam_category"],
            indicators=ocr_res["indicators"],
            extracted_entities=entities
        )
        return unified
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR evaluation error: {str(e)}")
