# 🛡️ VIGILANCE

## Autonomous Multi-Domain Coordination Platform

> **A comprehensive command center dashboard for defense intelligence and border surveillance operations.**

---

# 📚 PROJECT HANDBOOK

This document serves as the **complete reference guide** for the Vigilance platform. It covers architecture, implementation status, setup instructions, and development roadmap.

---

## Table of Contents

1. [Project Overview](#-project-overview)
2. [System Architecture](#-system-architecture)
3. [Technology Stack](#-technology-stack)
4. [Directory Structure](#-directory-structure)
5. [Frontend Guide](#-frontend-guide)
6. [Backend Guide](#-backend-guide)
7. [ML/AI Integration](#-mlai-integration)
8. [Data Flow](#-data-flow)
9. [Current Progress](#-current-progress)
10. [Remaining Work](#-remaining-work)
11. [Getting Started](#-getting-started)
12. [Deployment](#-deployment)
13. [API Reference](#-api-reference)
14. [Code Conventions](#-code-conventions)
15. [Troubleshooting](#-troubleshooting)

---

# 🎯 Project Overview

## What is Vigilance?

Vigilance is an **AI-powered autonomous surveillance platform** designed for military and border security operations. It combines:

- **Real-time sensor fusion** from multiple data sources (drones, cameras, radar, motion sensors)
- **AI-driven threat classification** using computer vision (YOLOv8)
- **Predictive analytics** for threat pattern recognition
- **Unified command dashboard** for operators

## Core Capabilities

| Capability | Description | Target Spec |
|------------|-------------|-------------|
| Threat Classification | AI classifies threats Level 1-5 | 95% accuracy, <5s response |
| Pattern Recognition | Predicts threats 24hrs ahead | 85% accuracy |
| Data Fusion | Combines 1000+ sensor inputs | <100ms latency |
| Real-time Alerts | WebSocket-based notifications | Instant delivery |

## Target Use Cases

- **LAC Border Monitoring** - High-altitude autonomous surveillance
- **Desert Perimeter Security** - 500km+ coverage zones
- **Coastal Security** - Maritime-land coordination
- **Counter-Terrorism** - Urban surveillance with civilian safety

---

# 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VIGILANCE SYSTEM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         PRESENTATION LAYER                          │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐   │    │
│  │  │   Navbar    │ │   Sidebar   │ │  Dashboard  │ │  ThreatMap   │   │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └──────────────┘   │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐   │    │
│  │  │ AlertsFeed  │ │  VideoFeed  │ │ Prediction  │ │  StatsCards  │   │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └──────────────┘   │    │
│  │                     React + Vite + Tailwind                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                          API LAYER                                  │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │ /threats │ │ /alerts  │ │ /sensors │ │/predict  │ │ /status  │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  │                                                                     │    │
│  │  ┌────────────────────────────────────────────────────────────────┐ │    │
│  │  │                    WebSocket (Socket.io)                       │ │    │
│  │  │              Real-time alerts, sensor updates                  │ │    │
│  │  └────────────────────────────────────────────────────────────────┘ │    │
│  │                     Express + TypeScript                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      ML/AI LAYER [TODO]                             │    │
│  │  ┌──────────────────┐ ┌──────────────────┐ ┌─────────────────────┐  │    │
│  │  │  YOLOv8 Object   │ │  LSTM Pattern    │ │  Ensemble Threat    │  │    │
│  │  │   Detection      │ │  Recognition     │ │  Classification     │  │    │
│  │  └──────────────────┘ └──────────────────┘ └─────────────────────┘  │    │
│  │                     Python + PyTorch/TensorFlow                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                       DATA LAYER [TODO]                             │    │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 │    │
│  │  │  PostgreSQL  │ │    Redis     │ │    Kafka     │                 │    │
│  │  │  (Alerts DB) │ │   (Cache)    │ │  (Streaming) │                 │    │
│  │  └──────────────┘ └──────────────┘ └──────────────┘                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     SENSOR LAYER [TODO]                             │    │
│  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐        │    │
│  │  │ Drone │ │Camera │ │ Radar │ │Motion │ │Thermal│ │ Satel │        │    │
│  │  └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 🛠 Technology Stack

## Current Implementation

| Layer | Technology | Status |
|-------|------------|--------|
| **Frontend** | React 18, Vite, TypeScript | ✅ Complete |
| **Styling** | Tailwind CSS (custom military theme) | ✅ Complete |
| **Maps** | Leaflet.js (dark theme) | ✅ Complete |
| **Charts** | Recharts | ✅ Complete |
| **Icons** | Lucide React | ✅ Complete |
| **Backend** | Express.js, TypeScript | ✅ Complete |
| **Real-time** | Socket.io | ✅ Complete |
| **Containerization** | Docker, docker-compose | ✅ Complete |

## Planned/TODO

| Layer | Technology | Status |
|-------|------------|--------|
| **ML/AI** | Python, PyTorch, YOLOv8 | ❌ TODO |
| **Database** | PostgreSQL | ❌ TODO |
| **Cache** | Redis | ❌ TODO |
| **Message Queue** | Apache Kafka | ❌ TODO |
| **Auth** | JWT, bcrypt | ❌ TODO |

---

# 📁 Directory Structure

```
vigilance-dashboard/
│
├── 📂 Docs/                          # Project documentation
│   ├── Project Layman.pdf            # Non-technical overview
│   └── Vigilance Proto Build Plan.pdf # Technical specifications
│
├── 📂 frontend/                      # React frontend application
│   ├── 📂 src/
│   │   ├── 📂 api/                   # API client layer
│   │   │   └── index.ts              # Axios instance + API functions
│   │   │
│   │   ├── 📂 components/            # React UI components
│   │   │   ├── AlertsFeed.tsx        # Real-time alerts list
│   │   │   ├── Dashboard.tsx         # Main dashboard layout
│   │   │   ├── Navbar.tsx            # Top navigation bar
│   │   │   ├── PredictionChart.tsx   # 24-hour threat forecast
│   │   │   ├── Sidebar.tsx           # Left navigation sidebar
│   │   │   ├── StatsCard.tsx         # Statistics display card
│   │   │   ├── ThreatMap.tsx         # Interactive Leaflet map
│   │   │   └── VideoFeed.tsx         # Simulated camera feed
│   │   │
│   │   ├── 📂 hooks/                 # Custom React hooks
│   │   │   └── useAlerts.ts          # Alert management hook
│   │   │
│   │   ├── 📂 styles/                # CSS and styling
│   │   │   └── globals.css           # Global styles + Tailwind
│   │   │
│   │   ├── 📂 types/                 # TypeScript definitions
│   │   │   └── index.ts              # All interfaces/types
│   │   │
│   │   ├── App.tsx                   # Root application component
│   │   └── main.tsx                  # React entry point
│   │
│   ├── index.html                    # HTML template
│   ├── package.json                  # Dependencies
│   ├── tailwind.config.js            # Tailwind configuration
│   ├── tsconfig.json                 # TypeScript config
│   ├── vite.config.ts                # Vite build config
│   ├── nginx.conf                    # Production nginx config
│   └── Dockerfile                    # Frontend container
│
├── 📂 backend/                       # Express backend API
│   ├── 📂 src/
│   │   ├── 📂 data/                  # Data layer
│   │   │   └── mockData.ts           # Demo mock data
│   │   │
│   │   ├── 📂 routes/                # API route handlers
│   │   │   ├── alerts.ts             # GET/PATCH /api/alerts
│   │   │   ├── health.ts             # GET /api/health
│   │   │   ├── predictions.ts        # GET /api/predictions
│   │   │   ├── sensors.ts            # GET /api/sensors
│   │   │   ├── status.ts             # GET /api/status
│   │   │   └── threats.ts            # GET /api/threats
│   │   │
│   │   ├── 📂 realtime/              # WebSocket handlers
│   │   │   └── alertSimulator.ts     # Demo alert generator
│   │   │
│   │   └── server.ts                 # Express app entry point
│   │
│   ├── package.json                  # Dependencies
│   ├── tsconfig.json                 # TypeScript config
│   └── Dockerfile                    # Backend container
│
├── 📂 ml/ [TODO]                     # Machine learning models
│   ├── 📂 models/                    # Trained model files
│   │   ├── yolov8_threat.pt          # Object detection model
│   │   ├── lstm_pattern.h5           # Pattern recognition
│   │   └── ensemble_classifier.pkl   # Threat classifier
│   │
│   ├── 📂 inference/                 # Inference servers
│   │   ├── object_detection.py       # YOLOv8 inference API
│   │   ├── pattern_recognition.py    # LSTM inference
│   │   └── threat_classifier.py      # Ensemble inference
│   │
│   ├── 📂 training/                  # Training scripts
│   │   ├── train_yolo.py
│   │   ├── train_lstm.py
│   │   └── train_ensemble.py
│   │
│   ├── requirements.txt              # Python dependencies
│   └── Dockerfile                    # ML container
│
├── docker-compose.yml                # Container orchestration
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
└── README.md                         # This handbook
```

---

# 🎨 Frontend Guide

## Component Hierarchy

```
App.tsx
├── Navbar.tsx                    # Fixed top bar
│   ├── Logo + Branding
│   ├── System Status (OPERATIONAL)
│   ├── Clock (real-time)
│   ├── Notifications Bell
│   └── User Dropdown
│
├── Sidebar.tsx                   # Fixed left navigation
│   ├── Navigation Menu (8 items)
│   └── System Status Bars
│
└── Dashboard.tsx                 # Main content area
    ├── StatsCard.tsx (×4)        # Top statistics row
    │   ├── Active Alerts
    │   ├── Personnel
    │   ├── Sensors Online
    │   └── Global Ops
    │
    ├── ThreatMap.tsx             # Interactive map (left)
    │   ├── Sensor markers
    │   ├── Threat zone circles
    │   └── Legend overlay
    │
    ├── VideoFeed.tsx             # Camera feed (right)
    │   ├── Detection boxes
    │   ├── Threat classification
    │   └── Timestamp overlay
    │
    ├── PredictionChart.tsx       # Forecast chart (left)
    │   ├── 24-hour timeline
    │   ├── Multi-sector lines
    │   └── Risk threshold
    │
    └── AlertsFeed.tsx            # Alerts list (right)
        ├── Priority coloring
        ├── Expandable details
        └── Acknowledge button
```

## Key Files Explained

### `src/types/index.ts`
Defines all TypeScript interfaces:
- `Threat` - Threat classification result
- `Alert` - Security notification
- `Sensor` - Sensor device info
- `PredictionPoint` - Forecast data

### `src/api/index.ts`
Axios client for backend communication:
- `getThreats()` - Fetch active threats
- `getAlerts()` - Fetch alerts (paginated)
- `getSensors()` - Fetch sensor status
- `getPredictions()` - Fetch 24hr forecast

### `src/hooks/useAlerts.ts`
Custom hook for alert management:
- Demo mode with simulated alerts
- Real-time updates (every 20s)
- Acknowledge functionality

### `tailwind.config.js`
Custom military theme:
- `command` colors (dark slate)
- `alert` colors (reds)
- `status` colors (green/yellow/red)
- Custom animations (pulse, radar-sweep)

---

# ⚙️ Backend Guide

## Express Server Structure

```
server.ts
├── Middleware
│   ├── helmet (security headers)
│   ├── cors (cross-origin)
│   └── express.json (body parsing)
│
├── Routes
│   ├── /api/health     → health.ts
│   ├── /api/threats    → threats.ts
│   ├── /api/alerts     → alerts.ts
│   ├── /api/sensors    → sensors.ts
│   ├── /api/predictions → predictions.ts
│   └── /api/status     → status.ts
│
├── WebSocket (Socket.io)
│   ├── 'connection' event
│   ├── 'alert:new' broadcasts
│   └── 'subscribe' for feeds
│
└── Alert Simulator
    └── Generates demo alerts every 15-45s
```

## Route Files

Each route file follows the pattern:
```typescript
// routes/example.ts
import { Router } from 'express';
import { MOCK_DATA } from '../data/mockData.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: MOCK_DATA,
    timestamp: new Date().toISOString(),
  });
});

export default router;
```

## Mock Data (`data/mockData.ts`)

Contains all demo data:
- `MOCK_THREATS` - 4 sample threats
- `MOCK_ALERTS` - 5 sample alerts
- `MOCK_SENSORS` - 12 sensors (cameras, radars, drones, etc.)
- `generatePredictions()` - Creates 24hr forecast

**🔴 TEAM TODO:** Replace this file's exports with database queries.

---

# 🤖 ML/AI Integration

## Planned Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ML SERVICE (Python)                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │              OBJECT DETECTION                   │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │          YOLOv8 (ultralytics)           │    │    │
│  │  │  - Input: Video frames (640×640)        │    │    │
│  │  │  - Output: Bounding boxes + labels      │    │    │
│  │  │  - Classes: person, vehicle, animal     │    │    │
│  │  │  - Target: <100ms inference             │    │    │
│  │  └─────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────┘    │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │            PATTERN RECOGNITION                  │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │             LSTM Network                │    │    │
│  │  │  - Input: Time-series sensor data       │    │    │
│  │  │  - Window: 48 hours historical          │    │    │
│  │  │  - Output: 24hr threat probability      │    │    │
│  │  │  - Per-sector predictions               │    │    │
│  │  └─────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────┘    │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │           THREAT CLASSIFICATION                 │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │      Ensemble (CNN + LSTM + RF)         │    │    │
│  │  │  - Combines detection + patterns        │    │    │
│  │  │  - Output: Threat level 1-5             │    │    │
│  │  │  - Confidence score 0-100%              │    │    │
│  │  │  - Target: 95% accuracy                 │    │    │
│  │  └─────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  API Endpoints (FastAPI):                               │
│  POST /detect     - Object detection on frame           │
│  POST /predict    - Pattern prediction                  │
│  POST /classify   - Threat classification               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Integration Points

### 1. Video Feed → Object Detection
```
Frontend: VideoFeed.tsx
    ↓ (captures frame)
Backend: POST /api/ml/detect
    ↓ (forwards to ML service)
ML Service: YOLOv8 inference
    ↓ (returns detections)
Frontend: Renders bounding boxes
```

### 2. Sensor Data → Pattern Recognition
```
Sensors: Motion, thermal, radar data
    ↓ (collected over 48hrs)
Backend: Aggregates time-series
    ↓ (sends to ML)
ML Service: LSTM prediction
    ↓ (24hr forecast)
Frontend: PredictionChart displays
```

### 3. Threat Classification
```
Detections + Patterns + Context
    ↓ (combined features)
ML Service: Ensemble classifier
    ↓ (threat level 1-5)
Backend: Creates alert if level ≥ 3
    ↓ (WebSocket broadcast)
Frontend: AlertsFeed updates
```

## Where to Add ML Code

Create: `ml/` directory at project root:

```bash
mkdir -p ml/{models,inference,training}
touch ml/requirements.txt
touch ml/Dockerfile
touch ml/inference/object_detection.py
touch ml/inference/pattern_recognition.py
touch ml/inference/threat_classifier.py
```

**Recommended ML requirements.txt:**
```
torch>=2.0.0
ultralytics>=8.0.0  # YOLOv8
tensorflow>=2.13.0  # LSTM
scikit-learn>=1.3.0 # Random Forest
fastapi>=0.100.0    # API server
uvicorn>=0.23.0     # ASGI server
opencv-python>=4.8.0
numpy>=1.24.0
```

---

# 🔄 Data Flow

## Real-time Alert Flow

```
1. Sensor detects anomaly
   │
2. ML classifies threat (Level 1-5)
   │
3. Backend creates Alert object
   │
4. WebSocket broadcasts 'alert:new'
   │
5. Frontend useAlerts hook receives
   │
6. AlertsFeed re-renders with new alert
   │
7. Operator acknowledges via UI
   │
8. PATCH /api/alerts/:id/acknowledge
   │
9. Alert status updated to 'acknowledged'
```

## Dashboard Refresh Cycle

```
┌────────────────────────────────────────────┐
│           Every 5 seconds                  │
├────────────────────────────────────────────┤
│ 1. Dashboard.tsx useEffect triggers        │
│ 2. Simulated stats fluctuation (demo)      │
│ 3. StatsCards re-render with new values    │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│           Every 20 seconds                 │
├────────────────────────────────────────────┤
│ 1. useAlerts hook generates demo alert     │
│ 2. AlertsFeed prepends new alert           │
│ 3. Notification count updates              │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│           WebSocket (real-time)            │
├────────────────────────────────────────────┤
│ 1. Backend alertSimulator fires            │
│ 2. Socket.io emits 'alert:new'             │
│ 3. All connected clients receive           │
└────────────────────────────────────────────┘
```

---

# 📊 Current Progress

## ✅ Completed

| Component | Description | Files |
|-----------|-------------|-------|
| Project Structure | Monorepo with frontend/backend | All directories |
| Frontend Core | Vite + React + TypeScript | `package.json`, configs |
| Tailwind Theme | Custom military dark theme | `tailwind.config.js` |
| Navbar | Top navigation with clock, status | `Navbar.tsx` |
| Sidebar | Collapsible nav with system status | `Sidebar.tsx` |
| Dashboard | Main layout composing all widgets | `Dashboard.tsx` |
| Stats Cards | 4 metric cards with animations | `StatsCard.tsx` |
| Threat Map | Leaflet map with sensors/threats | `ThreatMap.tsx` |
| Video Feed | Simulated camera with detections | `VideoFeed.tsx` |
| Alerts Feed | Real-time alert list | `AlertsFeed.tsx` |
| Prediction Chart | 24-hour forecast chart | `PredictionChart.tsx` |
| Type Definitions | All TypeScript interfaces | `types/index.ts` |
| API Client | Axios with interceptors | `api/index.ts` |
| Alerts Hook | Real-time alert state | `hooks/useAlerts.ts` |
| Backend Server | Express with Socket.io | `server.ts` |
| API Routes | All 6 endpoints | `routes/*.ts` |
| Mock Data | Demo data for all entities | `data/mockData.ts` |
| Alert Simulator | WebSocket demo broadcaster | `realtime/alertSimulator.ts` |
| Docker Setup | Frontend + Backend containers | `Dockerfile` × 2 |
| Docker Compose | Orchestration config | `docker-compose.yml` |
| Documentation | This handbook | `README.md` |

## ❌ Not Started (Team TODO)

| Component | Description | Priority |
|-----------|-------------|----------|
| Authentication | JWT login system | 🔴 High |
| Database | PostgreSQL + Prisma | 🔴 High |
| ML Service | Python + YOLOv8 | 🔴 High |
| Real Sensors | Actual data sources | 🔴 High |
| Pattern LSTM | Time-series prediction | 🟡 Medium |
| Ensemble Classifier | Threat level model | 🟡 Medium |
| User Management | Roles and permissions | 🟡 Medium |
| Audit Logging | Action tracking | 🟡 Medium |
| Additional Pages | Threats, Operations, etc. | 🟢 Low |
| Mobile Responsive | Tablet/phone layouts | 🟢 Low |

---

# 🚀 Getting Started

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 9+ or **yarn**
- **Docker** (for containerized deployment)
- **Python** 3.10+ (for ML, when implemented)

## Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd vigilance-dashboard
```

### 2. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend (new terminal)
cd ../backend
npm install
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# ✅ Running at http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# ✅ Running at http://localhost:5173
```

### 4. Open Dashboard

Navigate to **http://localhost:5173** in your browser.

---

# 🐳 Deployment

## Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Access:
# - Frontend: http://localhost:3000
# - Backend:  http://localhost:3001
```

## Manual Docker Build

```bash
# Build frontend
cd frontend
docker build -t vigilance-frontend .

# Build backend
cd ../backend
docker build -t vigilance-backend .

# Run
docker run -p 3000:80 vigilance-frontend
docker run -p 3001:3001 vigilance-backend
```

## Environment Variables

Copy `.env.example` to `.env`:

```env
# Backend
PORT=3001
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000

# Database (TODO)
# DATABASE_URL=postgresql://...

# Auth (TODO)
# JWT_SECRET=your-secret
```

---

# 📡 API Reference

## Base URL

- Development: `http://localhost:3001/api`
- Production: Configure via environment

## Endpoints

### Health Check
```
GET /api/health
Response: { success: true, data: { status: "healthy" } }
```

### Threats
```
GET /api/threats
GET /api/threats/active
GET /api/threats/:id
Response: { success: true, data: Threat[] }
```

### Alerts
```
GET /api/alerts?page=1&limit=20
GET /api/alerts/:id
PATCH /api/alerts/:id/acknowledge
Response: { success: true, data: Alert[], pagination: {...} }
```

### Sensors
```
GET /api/sensors
GET /api/sensors/:id
GET /api/sensors/sector/:sector
GET /api/sensors/stats
Response: { success: true, data: Sensor[] }
```

### Predictions
```
GET /api/predictions
GET /api/predictions/sector/:sector
Response: { success: true, data: SectorPrediction[] }
```

### System Status
```
GET /api/status
Response: { success: true, data: SystemStatus }
```

## WebSocket Events

```javascript
// Client connection
socket.on('connected', (msg) => console.log(msg));

// New alert broadcast
socket.on('alert:new', (alert) => {
  // Update UI with new alert
});

// Subscribe to specific feed
socket.emit('subscribe', 'alerts');
```

---

# 📐 Code Conventions

## File Naming
- Components: `PascalCase.tsx` (e.g., `AlertsFeed.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useAlerts.ts`)
- Routes: `lowercase.ts` (e.g., `alerts.ts`)
- Types: `index.ts` in `types/` directory

## Component Structure
```typescript
/**
 * =============================================================================
 * VIGILANCE DASHBOARD - Component Name
 * =============================================================================
 * 
 * Description of what this component does.
 * 
 * Props:
 * - propName: description
 * 
 * TODO: Future improvements
 * =============================================================================
 */

import React from 'react';

interface ComponentProps {
  // Props interface
}

const Component: React.FC<ComponentProps> = (props) => {
  // Implementation
};

export default Component;
```

## TODO Markers

Use these markers for team handoff:
```typescript
// TODO: Description of what needs to be done
// TODO: Replace mock data with real API
// TODO: Integrate YOLOv8 classification
```

---

# 🔧 Troubleshooting

## Common Issues

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend port already in use
```bash
# Find and kill process on port 3001
lsof -i :3001
kill -9 <PID>
```

### Docker build fails
```bash
# Clean Docker cache
docker system prune -a
docker-compose build --no-cache
```

### TypeScript errors after editing types
```bash
# Restart TypeScript server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

# 📞 Team Contacts

| Role | Responsibility |
|------|----------------|
| Frontend Lead | Dashboard UI, React components |
| Backend Lead | API routes, WebSocket, database |
| ML Engineer | YOLOv8, LSTM, classification models |
| DevOps | Docker, deployment, CI/CD |

---

# 📄 License

**Internal Project - Not for Public Distribution**

---

*Built for the Vigilance Team* 🛡️
