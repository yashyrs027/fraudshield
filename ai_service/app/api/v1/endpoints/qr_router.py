from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from app.models.schemas import QrAnalysisRequest, UnifiedAnalysisResponse
from app.services.qr_engine import QrEngine
from app.services.risk_engine import UnifiedRiskEngine
import uuid

router = APIRouter(prefix="/qr", tags=["QR & UPI Protocol Dissector"])

@router.post("/analyze-text", response_model=UnifiedAnalysisResponse)
async def analyze_qr_text(payload: QrAnalysisRequest):
    if not payload.qr_payload:
        raise HTTPException(status_code=400, detail="qr_payload string is required")
        
    try:
        qr_res = QrEngine.evaluate_qr_payload(payload.qr_payload)
        session_id = f"sess_{uuid.uuid4().hex[:12]}"
        
        scam_category = "REVERSE_UPI_COLLECT" if qr_res["warning_flag"] else "SAFE_UPI_PAYMENT"
        
        entities = {
            "vpa": qr_res["upi_payload"].vpa,
            "payee_name": qr_res["upi_payload"].payee_name,
            "amount": qr_res["upi_payload"].amount,
            "currency": qr_res["upi_payload"].currency,
            "transaction_note": qr_res["upi_payload"].transaction_note,
            "is_debit": qr_res["upi_payload"].is_debit_intent
        }
        
        unified = UnifiedRiskEngine.synthesize_unified_assessment(
            session_id=session_id,
            analysis_type="QR_IMAGE",
            scam_category=scam_category,
            indicators=qr_res["indicators"],
            extracted_entities=entities
        )
        return unified
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QR evaluation error: {str(e)}")

@router.post("/analyze-image", response_model=UnifiedAnalysisResponse)
async def analyze_qr_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        decoded_str = QrEngine.decode_qr_image(contents)
        qr_res = QrEngine.evaluate_qr_payload(decoded_str)
        session_id = f"sess_{uuid.uuid4().hex[:12]}"
        
        scam_category = "REVERSE_UPI_COLLECT" if qr_res["warning_flag"] else "SAFE_UPI_PAYMENT"
        
        entities = {
            "vpa": qr_res["upi_payload"].vpa,
            "payee_name": qr_res["upi_payload"].payee_name,
            "amount": qr_res["upi_payload"].amount,
            "currency": qr_res["upi_payload"].currency,
            "transaction_note": qr_res["upi_payload"].transaction_note,
            "is_debit": qr_res["upi_payload"].is_debit_intent,
            "raw_payload": decoded_str
        }
        
        unified = UnifiedRiskEngine.synthesize_unified_assessment(
            session_id=session_id,
            analysis_type="QR_IMAGE",
            scam_category=scam_category,
            indicators=qr_res["indicators"],
            extracted_entities=entities
        )
        return unified
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QR image processing error: {str(e)}")
