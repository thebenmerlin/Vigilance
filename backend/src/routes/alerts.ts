/**
 * =============================================================================
 * VIGILANCE BACKEND - Alerts Route
 * =============================================================================
 *
 * Endpoints for security alerts.
 *
 * Endpoints:
 * - GET /api/alerts - List all alerts (with pagination)
 * - GET /api/alerts/:id - Get single alert
 * - PATCH /api/alerts/:id/acknowledge - Acknowledge an alert
 *
 * TODO: Add database persistence
 * =============================================================================
 */

import { Router, Request, Response } from 'express';
import { MOCK_ALERTS, Alert } from '../data/mockData.js';

const router = Router();

// In-memory alert store (would be database in production)
let alerts: Alert[] = [...MOCK_ALERTS];

/**
 * GET /api/alerts
 * Returns paginated alerts list
 */
router.get('/', (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const priority = req.query.priority as string;

    // Filter by priority if provided
    let filteredAlerts = priority
        ? alerts.filter(a => a.priority === priority)
        : alerts;

    // Sort by timestamp (newest first)
    filteredAlerts = filteredAlerts.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedAlerts = filteredAlerts.slice(startIndex, startIndex + limit);

    res.json({
        success: true,
        data: paginatedAlerts,
        pagination: {
            page,
            pageSize: limit,
            totalItems: filteredAlerts.length,
            totalPages: Math.ceil(filteredAlerts.length / limit),
        },
        timestamp: new Date().toISOString(),
    });
});

/**
 * GET /api/alerts/:id
 * Returns a single alert by ID
 */
router.get('/:id', (req: Request, res: Response) => {
    const alert = alerts.find(a => a.id === req.params.id);

    if (!alert) {
        res.status(404).json({
            success: false,
            error: 'Alert not found',
            timestamp: new Date().toISOString(),
        });
        return;
    }

    res.json({
        success: true,
        data: alert,
        timestamp: new Date().toISOString(),
    });
});

/**
 * PATCH /api/alerts/:id/acknowledge
 * Acknowledge an alert
 */
router.patch('/:id/acknowledge', (req: Request, res: Response) => {
    const alertIndex = alerts.findIndex(a => a.id === req.params.id);

    if (alertIndex === -1) {
        res.status(404).json({
            success: false,
            error: 'Alert not found',
            timestamp: new Date().toISOString(),
        });
        return;
    }

    // Update alert status
    alerts[alertIndex] = {
        ...alerts[alertIndex],
        status: 'acknowledged',
    };

    res.json({
        success: true,
        data: alerts[alertIndex],
        message: 'Alert acknowledged successfully',
        timestamp: new Date().toISOString(),
    });
});

/**
 * Add a new alert (used by alert simulator)
 */
export function addAlert(alert: Alert): void {
    alerts.unshift(alert);
    // Keep only last 100 alerts in memory
    if (alerts.length > 100) {
        alerts = alerts.slice(0, 100);
    }
}

export default router;
