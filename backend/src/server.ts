/**
 * =============================================================================
 * VIGILANCE BACKEND - Main Server Entry Point
 * =============================================================================
 * 
 * Express.js server with:
 * - RESTful API routes
 * - Socket.io for real-time updates
 * - Security middleware (Helmet, CORS)
 * - Demo data generation
 * 
 * Environment Variables:
 * - PORT: Server port (default: 3001)
 * - NODE_ENV: Environment (development/production)
 * - CORS_ORIGIN: Allowed CORS origin (default: http://localhost:5173)
 * 
 * API Endpoints:
 * - GET  /api/health     - Health check
 * - GET  /api/threats    - Current threats
 * - GET  /api/alerts     - Recent alerts
 * - GET  /api/sensors    - Sensor status
 * - GET  /api/predictions - Threat predictions
 * - GET  /api/status     - System status
 * 
 * TODO: Add authentication middleware
 * TODO: Connect to real data sources
 * =============================================================================
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

// Import routes
import healthRouter from './routes/health.js';
import threatsRouter from './routes/threats.js';
import alertsRouter from './routes/alerts.js';
import sensorsRouter from './routes/sensors.js';
import predictionsRouter from './routes/predictions.js';
import statusRouter from './routes/status.js';
import mlProxyRouter from './routes/mlProxy.js';

// Import real-time event simulator
import { startAlertSimulator } from './realtime/alertSimulator.js';

// =============================================================================
// CONFIGURATION
// =============================================================================

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

// =============================================================================
// EXPRESS APP SETUP
// =============================================================================

const app: Express = express();
const httpServer = createServer(app);

// Socket.io for real-time updates
const io = new SocketServer(httpServer, {
    cors: {
        origin: CORS_ORIGIN,
        methods: ['GET', 'POST'],
    },
});

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Security headers
app.use(helmet({
    // Disable COEP for development (allows loading external resources)
    crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
    credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Request logging (development only)
if (NODE_ENV === 'development') {
    app.use((req: Request, _res: Response, next: NextFunction) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
        next();
    });
}

// =============================================================================
// API ROUTES
// =============================================================================

// Mount route handlers
app.use('/api/health', healthRouter);
app.use('/api/threats', threatsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/sensors', sensorsRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/status', statusRouter);
app.use('/api/ml', mlProxyRouter);

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
    res.json({
        name: 'Vigilance Backend API',
        version: '1.0.0',
        status: 'operational',
        documentation: '/api/health',
    });
});

// =============================================================================
// ERROR HANDLING
// =============================================================================

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        timestamp: new Date().toISOString(),
    });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Error]', err.message);

    res.status(500).json({
        success: false,
        error: NODE_ENV === 'development' ? err.message : 'Internal server error',
        timestamp: new Date().toISOString(),
    });
});

// =============================================================================
// SOCKET.IO SETUP
// =============================================================================

io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Send welcome message
    socket.emit('connected', {
        message: 'Connected to Vigilance real-time feed',
        timestamp: new Date().toISOString(),
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
    });

    // Handle subscription to specific feeds
    socket.on('subscribe', (feed: string) => {
        console.log(`[Socket] ${socket.id} subscribed to: ${feed}`);
        socket.join(feed);
    });
});

// Start alert simulator (generates fake alerts for demo)
startAlertSimulator(io);

// =============================================================================
// SERVER START
// =============================================================================

httpServer.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ██╗   ██╗██╗ ██████╗ ██╗██╗      █████╗ ███╗   ██╗ ██████╗███████╗   ║
║   ██║   ██║██║██╔════╝ ██║██║     ██╔══██╗████╗  ██║██╔════╝██╔════╝   ║
║   ██║   ██║██║██║  ███╗██║██║     ███████║██╔██╗ ██║██║     █████╗     ║
║   ╚██╗ ██╔╝██║██║   ██║██║██║     ██╔══██║██║╚██╗██║██║     ██╔══╝     ║
║    ╚████╔╝ ██║╚██████╔╝██║███████╗██║  ██║██║ ╚████║╚██████╗███████╗   ║
║     ╚═══╝  ╚═╝ ╚═════╝ ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝   ║
║                                                            ║
║   Backend API Server                                       ║
║   ─────────────────────────────────────────────────────    ║
║   Status:      OPERATIONAL                                 ║
║   Port:        ${PORT}                                          ║
║   Environment: ${NODE_ENV.padEnd(12)}                             ║
║   API:         http://localhost:${PORT}/api                     ║
║   WebSocket:   ws://localhost:${PORT}                           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('[Server] SIGTERM received, shutting down gracefully...');
    httpServer.close(() => {
        console.log('[Server] Server closed');
        process.exit(0);
    });
});

export default app;
