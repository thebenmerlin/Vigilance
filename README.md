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

## ☁️ Cloud Deployment (Render & Vercel)

The platform is fully configured for production deployment using **Render** (for the backend and ML services) and **Vercel** (for the frontend dashboard).

### 1. Deploy Databases
Before deploying the services, you must provision managed databases (e.g., Supabase/Neon for Postgres, AuraDB for Neo4j, Upstash/Render for Redis). Keep their connection URIs handy.

### 2. Deploy Backend & ML Services (Render)
The repository includes a `render.yaml` Blueprint which automatically configures both the Node.js API and the Python ML service.

1. Create a [Render](https://render.com/) account and connect your GitHub repository.
2. Click **New +** > **Blueprint**.
3. Select this repository. Render will automatically detect the `vigilance-backend` and `vigilance-ml-service` from the `render.yaml` file.
4. Fill in the required environment variables in the Render dashboard for the **Node.js Backend**:
   - `CORS_ORIGIN`: Your soon-to-be Vercel frontend URL (e.g., `https://your-app.vercel.app`)
   - `ML_SERVICE_URL`: The internal Render URL of your ML Service (e.g., `http://vigilance-ml-service:8000`)
   - `DATABASE_URL`: Your production PostgreSQL URI
   - `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`: Your AuraDB credentials
   - `REDIS_URL`: Your Redis instance URI
   - `JWT_SECRET`: A secure random string for authentication
5. Fill in the required environment variables for the **Python ML Service**:
   - `CORS_ORIGIN`: Your soon-to-be Vercel frontend URL (e.g., `https://your-app.vercel.app`)
   - `OPENAI_API_KEY`: (Optional) If utilizing the external LLM copilot.

### 3. Deploy Frontend (Vercel)
The React dashboard is optimized for Vercel. SPA routing is automatically handled via the included `vercel.json`.

1. Create a [Vercel](https://vercel.com/) account and select **Add New...** > **Project**.
2. Import this repository.
3. In the "Configure Project" step, update the following:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
4. Add the following **Environment Variables**:
   - `VITE_API_URL`: The public URL of your deployed Node.js backend on Render (e.g., `https://vigilance-backend.onrender.com/api`).
5. Click **Deploy**.

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
