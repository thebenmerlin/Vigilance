/**
 * =============================================================================
 * VIGILANCE BACKEND - Threats Route
 * =============================================================================
 *
 * Endpoints for threat classification data.
 *
 * Endpoints:
 * - GET /api/threats - List all threats
 * - GET /api/threats/active - List active threats only
 * - GET /api/threats/:id - Get single threat by ID
 *
 * TODO: Connect to AI classification engine
 * =============================================================================
 */

import { Router, Request, Response } from 'express';
import { MOCK_THREATS } from '../data/mockData.js';

const router = Router();

/**
 * GET /api/threats
 * Returns all threats (active and historical)
 */
router.get('/', (_req: Request, res: Response) => {
    res.json({
        success: true,
        data: MOCK_THREATS,
        timestamp: new Date().toISOString(),
    });
});

/**
 * GET /api/threats/active
 * Returns only active (unresolved) threats
 */
router.get('/active', (_req: Request, res: Response) => {
    const activeThreats = MOCK_THREATS.filter(t => t.isActive);

    res.json({
        success: true,
        data: activeThreats,
        count: activeThreats.length,
        timestamp: new Date().toISOString(),
    });
});

/**
 * GET /api/threats/:id
 * Returns a single threat by ID
 */
router.get('/:id', (req: Request, res: Response) => {
    const threat = MOCK_THREATS.find(t => t.id === req.params.id);

    if (!threat) {
        res.status(404).json({
            success: false,
            error: 'Threat not found',
            timestamp: new Date().toISOString(),
        });
        return;
    }

    res.json({
        success: true,
        data: threat,
        timestamp: new Date().toISOString(),
    });
});

export default router;
