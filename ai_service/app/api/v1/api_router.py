from fastapi import APIRouter
from app.api.v1.endpoints import message_router, qr_router, ocr_router, url_router

api_router = APIRouter()
api_router.include_router(message_router.router)
api_router.include_router(qr_router.router)
api_router.include_router(ocr_router.router)
api_router.include_router(url_router.router)
