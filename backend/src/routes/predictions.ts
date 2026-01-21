/**
 * =============================================================================
 * VIGILANCE BACKEND - Predictions Route
 * =============================================================================
 * 
 * Endpoints for threat predictions (24-hour forecasts).
 * 
 * Endpoints:
 * - GET /api/predictions - Get all sector predictions
 * - GET /api/predictions/sector/:sector - Get predictions for specific sector
 * 
 * TODO: Connect to ML prediction model
 * =============================================================================
 */

import { Router, Request, Response } from 'express';
import { generatePredictions } from '../data/mockData.js';

const router = Router();

/**
 * GET /api/predictions
 * Returns 24-hour predictions for all sectors
 */
router.get('/', (_req: Request, res: Response) => {
    const predictions = generatePredictions();

    // Group by sector
    const sectors = ['Alpha', 'Bravo', 'Charlie', 'Delta'];
    const sectorPredictions = sectors.map((sector) => {
        const sectorData = predictions.filter(p => p.sector === sector);
        const peakPoint = sectorData.reduce((max, p) =>
            p.threatProbability > max.threatProbability ? p : max
            , sectorData[0]);

        return {
            sector,
            next24Hours: sectorData,
            peakThreatTime: peakPoint.timestamp,
            peakThreatProbability: peakPoint.threatProbability,
            riskLevel: peakPoint.threatProbability >= 70 ? 'extreme' :
                peakPoint.threatProbability >= 50 ? 'high' :
                    peakPoint.threatProbability >= 30 ? 'moderate' : 'low',
        };
    });

    res.json({
        success: true,
        data: sectorPredictions,
        modelVersion: '2.1.0',
        timestamp: new Date().toISOString(),
    });
});

/**
 * GET /api/predictions/sector/:sector
 * Returns predictions for a specific sector
 */
router.get('/sector/:sector', (req: Request, res: Response) => {
    const sectorName = req.params.sector.charAt(0).toUpperCase() + req.params.sector.slice(1).toLowerCase();
    const predictions = generatePredictions().filter(p => p.sector === sectorName);

    if (predictions.length === 0) {
        res.status(404).json({
            success: false,
            error: 'Sector not found',
            timestamp: new Date().toISOString(),
        });
        return;
    }

    const peakPoint = predictions.reduce((max, p) =>
        p.threatProbability > max.threatProbability ? p : max
        , predictions[0]);

    res.json({
        success: true,
        data: {
            sector: sectorName,
            next24Hours: predictions,
            peakThreatTime: peakPoint.timestamp,
            peakThreatProbability: peakPoint.threatProbability,
            riskLevel: peakPoint.threatProbability >= 70 ? 'extreme' :
                peakPoint.threatProbability >= 50 ? 'high' :
                    peakPoint.threatProbability >= 30 ? 'moderate' : 'low',
        },
        modelVersion: '2.1.0',
        timestamp: new Date().toISOString(),
    });
});

export default router;
