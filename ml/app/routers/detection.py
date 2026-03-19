from fastapi import APIRouter
from pydantic import BaseModel
import time
import random

router = APIRouter()

class DetectionRequest(BaseModel):
    source_id: str
    spectral_type: str = 'optical'
    timestamp: float

@router.post("/")
def detect_objects(req: DetectionRequest):
    """
    Mock object detection.
    In production, this would receive a base64 image or RTSP URL and run a YOLOv8 or RT-DETR model.
    Returns bounding boxes, labels, confidences, and anomaly scores.
    """
    time.sleep(0.1)  # Simulate network latency and inference
    return {
        "status": "success",
        "detections": [
            {
                "id": f"det-{int(time.time() * 1000)}",
                "label": "Vehicle - Truck" if random.random() > 0.5 else "Personnel - Armed",
                "confidence": round(random.uniform(85, 98), 2),
                "threatLevel": random.randint(1, 5),
                "bbox": {
                    "x": random.randint(10, 80),
                    "y": random.randint(10, 80),
                    "width": random.randint(10, 30),
                    "height": random.randint(10, 30)
                },
                "biometrics": {
                    "anomaly_score": random.randint(40, 95),
                    "kinetic_velocity": f"{random.randint(1, 8)}m/s"
                }
            }
        ]
    }