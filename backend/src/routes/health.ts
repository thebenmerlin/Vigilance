/**
 * =============================================================================
 * VIGILANCE BACKEND - Health Check Route
 * =============================================================================
 * 
 * Provides system health information for monitoring and load balancers.
 * 
 * Endpoints:
 * - GET /api/health - Basic health check
 * - GET /api/health/detailed - Detailed system status
 * =============================================================================
 */

import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/health
 * Basic health check - returns 200 if server is running
 */
router.get('/', (_req: Request, res: Response) => {
    res.json({
        success: true,
        data: {
            status: 'healthy',
            service: 'vigilance-backend',
            version: '1.0.0',
        },
        timestamp: new Date().toISOString(),
    });
});

/**
 * GET /api/health/detailed
 * Detailed health check with memory and uptime info
 */
router.get('/detailed', (_req: Request, res: Response) => {
    const memoryUsage = process.memoryUsage();

    res.json({
        success: true,
        data: {
            status: 'healthy',
            service: 'vigilance-backend',
            version: '1.0.0',
            uptime: process.uptime(),
            memory: {
                heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
                heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
                rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
            },
            environment: process.env.NODE_ENV || 'development',
        },
        timestamp: new Date().toISOString(),
    });
});

export default router;
