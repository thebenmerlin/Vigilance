from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import random

from app.routers import detection, prediction, chat, swarm

app = FastAPI(
    title="Vigilance ML Service",
    description="Palantir-grade AI inference service for object detection, pattern recognition, and LLM copilot.",
    version="1.0.0",
)

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(detection.router, prefix="/api/v1/ml/detect", tags=["Vision"])
app.include_router(prediction.router, prefix="/api/v1/ml/predict", tags=["Trajectory"])
app.include_router(chat.router, prefix="/api/v1/ml/chat", tags=["Copilot"])
app.include_router(swarm.router, prefix="/api/v1/ml/swarm", tags=["Auto-Tasking"])

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "timestamp": time.time(),
        "models_loaded": ["YOLOv8-Sim", "Transformer-Sim", "LLaMA-Sim"],
        "gpu_available": False
    }