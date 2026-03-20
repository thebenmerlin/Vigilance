from fastapi import APIRouter
from pydantic import BaseModel
import time
import math

router = APIRouter()

class Asset(BaseModel):
    id: str
    lat: float
    lng: float
    speed_ms: float = 15.0

class Threat(BaseModel):
    id: str
    lat: float
    lng: float
    predicted_path: list[list[float]] = []

class SwarmRequest(BaseModel):
    threat: Threat
    assets: list[Asset]

@router.post("/")
def optimize_intercept(req: SwarmRequest):
    """
    Mock swarm optimizer.
    In production, this calculates optimal dynamic intercept paths for multi-agent drones
    using heuristic or reinforcement learning methods, accounting for terrain, no-fly zones,
    and target velocity.
    """
    time.sleep(0.3)  # Compute paths

    intercept_plan = []

    for asset in req.assets:
        # Simple straight line to target for the mock
        path = [
            [asset.lat, asset.lng],
            # Add a slight curve point (midpoint + random jitter)
            [asset.lat + (req.threat.lat - asset.lat) * 0.5 + 0.001,
             asset.lng + (req.threat.lng - asset.lng) * 0.5 - 0.001],
            [req.threat.lat, req.threat.lng]
        ]

        # Haversine distance mock
        dist = math.sqrt((req.threat.lat - asset.lat)**2 + (req.threat.lng - asset.lng)**2) * 111000 # meters approx
        time_to_intercept = int(dist / asset.speed_ms)

        intercept_plan.append({
            "asset_id": asset.id,
            "path": path,
            "estimated_time_s": time_to_intercept
        })

    return {
        "status": "success",
        "threat_id": req.threat.id,
        "intercept_plan": sorted(intercept_plan, key=lambda x: x["estimated_time_s"])
    }