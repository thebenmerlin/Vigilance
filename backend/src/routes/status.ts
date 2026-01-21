/**
 * =============================================================================
 * VIGILANCE BACKEND - System Status Route
 * =============================================================================
 * 
 * Endpoints for overall system status.
 * 
 * Endpoints:
 * - GET /api/status - Get current system status
 * =============================================================================
 */

import { Router, Request, Response } from 'express';
import { getSystemStatus } from '../data/mockData.js';

const router = Router();

/**
 * GET /api/status
 * Returns overall system status
 */
router.get('/', (_req: Request, res: Response) => {
    const status = getSystemStatus();

    res.json({
        success: true,
        data: status,
        timestamp: new Date().toISOString(),
    });
});

export default router;
