from fastapi import APIRouter
from pydantic import BaseModel
import time
import random

router = APIRouter()

class PredictionRequest(BaseModel):
    entity_id: str
    current_lat: float
    current_lng: float
    history: list[dict] = []
    horizon_minutes: int = 60

@router.post("/")
def predict_trajectory(req: PredictionRequest):
    """
    Mock trajectory prediction.
    In production, uses LSTM or Transformer models based on historical coordinates,
    terrain maps, and velocity vectors.
    Returns an array of predicted [lat, lng] points for the Chronos interface.
    """
    time.sleep(0.2)  # Simulate compute

    # Generate a simple forward trajectory
    path = [[req.current_lat, req.current_lng]]
    curr_lat, curr_lng = req.current_lat, req.current_lng

    for _ in range(req.horizon_minutes // 5):
        # Add random walk drift biased to one direction
        curr_lat += random.uniform(-0.001, 0.003)
        curr_lng += random.uniform(-0.001, 0.003)
        path.append([round(curr_lat, 5), round(curr_lng, 5)])

    return {
        "status": "success",
        "entity_id": req.entity_id,
        "predicted_path": path,
        "confidence": round(random.uniform(70, 95), 2),
        "horizon": f"+{req.horizon_minutes}m"
    }