from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "FraudShield AI & Threat Intelligence Service"
    API_V1_STR: str = "/api/v1"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    
    # Security & CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5000"
    ]
    
    # Internal shared secret for gateway-to-AI communication
    INTERNAL_SERVICE_TOKEN: str = "fraudshield_internal_ml_service_token_2026"
    
    # Scoring Thresholds
    RISK_THRESHOLD_LOW: int = 30
    RISK_THRESHOLD_MEDIUM: int = 70
    RISK_THRESHOLD_HIGH: int = 90

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
