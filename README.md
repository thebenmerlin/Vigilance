# 🛡️ VIGILANCE: Command Center

**Autonomous Multi-Domain Coordination Platform**

Vigilance is an AI-powered, real-time command dashboard designed for high-stakes operational environments (border security, multi-domain surveillance). It fuses massive sensor telemetry, predictive threat modeling, and generative AI into a single, comprehensive "Ontology" of the battlespace.

---

## 🏗️ Architecture

The Vigilance platform is built on a microservices architecture, emphasizing low-latency data fusion, high-availability storage, and advanced machine learning models.

```mermaid
graph TD;
    Client[React Frontend Dashboard] <--> |REST / WebSockets| API(Node.js Gateway API);
    API <--> Cache[(Redis - Pub/Sub & Cache)];
    API <--> Telemetry[(TimescaleDB - Time-Series)];
    API <--> Graph[(Neo4j - Entity Link Analysis)];
    API <--> ML[Python FastAPI - ML Service];

    ML --> CV[YOLOv8 / RT-DETR Vision Model];
    ML --> NLP[LangChain / Llama 3 Vanguard AI];
    ML --> Predict[Transformer Trajectory Prediction];
    ML --> Swarm[Heuristic Drone Auto-Tasking];

    Sensors[Drones / Radar / Thermal] --> |Kafka/MQTT| API;
```

### 1. Presentation Layer (Frontend)
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS (Dark Tactical Theme)
- **Features:**
  - **Nexus Graph:** Force-directed entity link analysis (`react-force-graph-2d`).
  - **Chronos Interface:** Temporal scrubbing for historical tracking and future trajectory projection.
  - **Vanguard AI:** Conversational operational copilot overlay.
  - **Multi-Spectral Video:** Real-time optical, thermal, night-vision, and SAR feeds with biometric anomaly overlays.

### 2. Application Layer (Backend Gateway)
- **Framework:** Node.js + Express + TypeScript
- **Real-Time:** Socket.io for sub-second telemetry broadcasting.
- **Role:** Handles client authentication, API routing, and acts as the orchestrator between databases and the ML microservice.

### 3. Intelligence Layer (ML Service)
- **Framework:** Python 3.10 + FastAPI
- **Models:**
  - **Vision:** Object detection and multi-spectral anomaly scoring.
  - **Prediction:** Time-series forecasting for threat paths (ghost-tracks).
  - **LLM / RAG:** Generative AI for operational queries against the Knowledge Graph.
  - **Swarm Logic:** Dynamic multi-agent routing for drone interception.

### 4. Data Layer (The Ontology)
- **Graph Database (Neo4j):** Stores the relationships between entities (e.g., `VEHICLE-1` is `PROXIMATE_TO` `PERSONNEL-A`).
- **Time-Series (TimescaleDB / PostgreSQL):** Stores high-frequency sensor readings, bounding box coordinates, and kinetic vectors.
- **Cache (Redis):** Manages ephemeral state, active session data, and WebSocket Pub/Sub.

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose (Recommended)
- Node.js 20+
- Python 3.10+ (for local ML dev)

### Deployment (Docker)

The fastest way to spin up the entire Vigilance stack (Frontend, Backend Gateway, ML Service, and Databases) is via Docker Compose.

```bash
git clone <repository-url>
cd vigilance-dashboard

# Build and start all services in detached mode
docker-compose up --build -d
```

**Access Points:**
- **Dashboard UI:** `http://localhost:3000`
- **Backend API:** `http://localhost:3001`
- **ML Service Docs:** `http://localhost:8000/docs`

### Local Development

If you prefer to run services individually for active development:

**1. Infrastructure (Databases)**
```bash
docker-compose up redis neo4j postgres -d
```

**2. ML Service (Python)**
```bash
cd ml
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**3. Backend Gateway (Node.js)**
```bash
cd backend
npm install
npm run dev
```

**4. Frontend Dashboard (React)**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔧 Configuration

Environment variables map core service connections. Copy the example file in each directory:

**Backend (`backend/.env`):**
```env
PORT=3001
NODE_ENV=development
ML_SERVICE_URL=http://localhost:8000
REDIS_URL=redis://localhost:6379
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=secret
DATABASE_URL=postgres://user:pass@localhost:5432/vigilance
```

**ML Service (`ml/.env`):**
```env
MODEL_CACHE_DIR=./models
OPENAI_API_KEY=your-key-here # For Vanguard AI (if using external LLM)
```

---

## 📄 License

Proprietary Software. All rights reserved. Not for public distribution.
