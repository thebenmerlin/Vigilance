/**
 * =============================================================================
 * VIGILANCE BACKEND - Sensors Route
 * =============================================================================
 * 
 * Endpoints for sensor status and data.
 * 
 * Endpoints:
 * - GET /api/sensors - List all sensors
 * - GET /api/sensors/:id - Get single sensor
 * - GET /api/sensors/sector/:sector - Get sensors by sector
 * - GET /api/sensors/stats - Get sensor statistics
 * 
 * TODO: Connect to actual sensor network
 * =============================================================================
 */

import { Router, Request, Response } from 'express';
import { MOCK_SENSORS } from '../data/mockData.js';

const router = Router();

/**
 * GET /api/sensors
 * Returns all sensors with their current status
 */
router.get('/', (req: Request, res: Response) => {
    const type = req.query.type as string;
    const status = req.query.status as string;

    let sensors = [...MOCK_SENSORS];

    // Filter by type if provided
    if (type) {
        sensors = sensors.filter(s => s.type === type);
    }

    // Filter by status if provided
    if (status) {
        sensors = sensors.filter(s => s.status === status);
    }

    res.json({
        success: true,
        data: sensors,
        count: sensors.length,
        timestamp: new Date().toISOString(),
    });
});

/**
 * GET /api/sensors/stats
 * Returns sensor statistics overview
 */
router.get('/stats', (_req: Request, res: Response) => {
    const stats = {
        total: MOCK_SENSORS.length,
        byStatus: {
            operational: MOCK_SENSORS.filter(s => s.status === 'operational').length,
            degraded: MOCK_SENSORS.filter(s => s.status === 'degraded').length,
            offline: MOCK_SENSORS.filter(s => s.status === 'offline').length,
            maintenance: MOCK_SENSORS.filter(s => s.status === 'maintenance').length,
        },
        byType: {
            camera: MOCK_SENSORS.filter(s => s.type === 'camera').length,
            radar: MOCK_SENSORS.filter(s => s.type === 'radar').length,
            motion: MOCK_SENSORS.filter(s => s.type === 'motion').length,
            drone: MOCK_SENSORS.filter(s => s.type === 'drone').length,
            thermal: MOCK_SENSORS.filter(s => s.type === 'thermal').length,
        },
        averageSignalStrength: Math.round(
            MOCK_SENSORS.reduce((sum, s) => sum + s.signalStrength, 0) / MOCK_SENSORS.length
        ),
    };

    res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
    });
});

/**
 * GET /api/sensors/:id
 * Returns a single sensor by ID
 */
router.get('/:id', (req: Request, res: Response) => {
    const sensor = MOCK_SENSORS.find(s => s.id === req.params.id);

    if (!sensor) {
        res.status(404).json({
            success: false,
            error: 'Sensor not found',
            timestamp: new Date().toISOString(),
        });
        return;
    }

    res.json({
        success: true,
        data: sensor,
        timestamp: new Date().toISOString(),
    });
});

/**
 * GET /api/sensors/sector/:sector
 * Returns sensors in a specific sector
 */
router.get('/sector/:sector', (req: Request, res: Response) => {
    const sectorSensors = MOCK_SENSORS.filter(
        s => s.sector.toLowerCase() === req.params.sector.toLowerCase()
    );

    res.json({
        success: true,
        data: sectorSensors,
        count: sectorSensors.length,
        timestamp: new Date().toISOString(),
    });
});

export default router;
