from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api_router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Dedicated Indian FinTech Pre-Transaction Fraud Prevention & Explainable Risk Scoring Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health & Observability"])
async def health_check():
    return {
        "status": "healthy",
        "service": "FraudShield AI & ML Intelligence Engine",
        "version": "1.0.0",
        "engines": {
            "nlp": "ready",
            "ocr": "ready",
            "qr_parser": "ready",
            "url_inspector": "ready",
            "risk_engine": "ready"
        }
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "FraudShield AI Service is operational. Refer to /docs for OpenAPI documentation."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
