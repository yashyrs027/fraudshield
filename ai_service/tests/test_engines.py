import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.text_preprocessor import TextPreprocessor
from app.services.nlp_engine import NlpEngine
from app.services.qr_engine import QrEngine
from app.services.url_inspector import UrlInspector
from app.services.risk_engine import UnifiedRiskEngine

def test_language_detection():
    hindi_text = "प्रिय ग्राहक, आपका बिजली बिल बकाया है। तुरंत भुगतान करें।"
    assert TextPreprocessor.detect_language(hindi_text) == "hi"

    english_text = "Dear Customer, your electricity power will be cut tonight."
    assert TextPreprocessor.detect_language(english_text) == "en"

def test_electricity_scam_detection():
    sms = "Dear Customer, your electricity power will be disconnected tonight at 9:30 PM. Call Officer at 9876543210 immediately."
    res = NlpEngine.analyze_message(sms, "VM-POWERT")
    assert res["scam_category"] == "ELECTRICITY_BILL_SCAM"
    assert res["urgency_score"] >= 45
    assert len(res["indicators"]) > 0

def test_reverse_upi_collect_detection():
    # UPI URI disguised as cashback reward
    uri = "upi://pay?pa=scam_mule@ybl&pn=RewardDesk&am=4999.00&cu=INR&tn=Cashback%20Reward"
    res = QrEngine.evaluate_qr_payload(uri)
    assert res["upi_payload"].is_upi is True
    assert res["warning_flag"] == "DECEPTIVE_CASHBACK_REVERSE_DEBIT"
    assert any(ind.code == "REVERSE_COLLECT_INTENT_DISGUISE" for ind in res["indicators"])

def test_url_anti_ssrf_and_typosquatting():
    # Anti-SSRF private IP test
    res_ssrf = UrlInspector.evaluate_url("http://127.0.0.1:8080/admin")
    assert any(ind.code == "SSRF_PRIVATE_NETWORK_TARGET" for ind in res_ssrf["indicators"])

    # Typosquatting test
    res_typo = UrlInspector.evaluate_url("http://sbi-kyc-verify-portal.in/login.php")
    assert res_typo["is_typosquatting"] is True

    # Direct APK test
    res_apk = UrlInspector.evaluate_url("https://electricity-board.in/update.apk")
    assert res_apk["contains_direct_apk"] is True

def test_unified_risk_engine_scoring():
    sms = "Dear Customer, your SBI account is blocked today due to pending KYC update. Click bit.ly/sbi-updt"
    nlp_res = NlpEngine.analyze_message(sms, "AD-SBINB")
    unified = UnifiedRiskEngine.synthesize_unified_assessment(
        session_id="test_sess_1",
        analysis_type="TEXT_MESSAGE",
        scam_category=nlp_res["scam_category"],
        indicators=nlp_res["indicators"],
        extracted_entities=nlp_res["extracted_entities"]
    )
    assert unified.risk_score >= 70
    assert unified.risk_level in ["HIGH", "CRITICAL"]
    assert len(unified.actionable_advice) > 0

if __name__ == "__main__":
    test_language_detection()
    test_electricity_scam_detection()
    test_reverse_upi_collect_detection()
    test_url_anti_ssrf_and_typosquatting()
    test_unified_risk_engine_scoring()
    print("All Python Intelligence Unit Tests Passed Successfully!")
