import { Router, Request, Response } from 'express';
import { neo4jDriver } from '../data/db/index.js';

const router = Router();

/**
 * GET /api/threats
 * Returns all threats (active and historical)
 */
router.get('/', async (_req: Request, res: Response) => {
    try {
        if (!neo4jDriver) {
            throw new Error('Neo4j Driver not initialized');
        }
        const session = neo4jDriver.session();
        try {
            const result = await session.run('MATCH (t:Threat) RETURN t ORDER BY t.lastUpdated DESC');
            const threats = result.records.map(record => {
                const node = record.get('t').properties;
                return {
                    ...node,
                    classification: node.type, // Map Neo4j type back to frontend classification
                    timestamp: node.firstDetected, // Map DB firstDetected to frontend timestamp
                    location: typeof node.location === 'string' ? JSON.parse(node.location) : node.location,
                    level: node.level.toNumber ? node.level.toNumber() : node.level,
                    confidence: node.confidence.toNumber ? node.confidence.toNumber() : node.confidence
                };
            });

            res.json({
                success: true,
                data: threats,
                timestamp: new Date().toISOString(),
            });
        } finally {
            await session.close();
        }
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /api/threats/active
 * Returns only active (unresolved) threats
 */
router.get('/active', async (_req: Request, res: Response) => {
    try {
        if (!neo4jDriver) {
             throw new Error('Neo4j Driver not initialized');
        }
        const session = neo4jDriver.session();
        try {
            const result = await session.run('MATCH (t:Threat {isActive: true}) RETURN t ORDER BY t.lastUpdated DESC');
            const activeThreats = result.records.map(record => {
                 const node = record.get('t').properties;
                 return {
                     ...node,
                     classification: node.type,
                     timestamp: node.firstDetected,
                     location: typeof node.location === 'string' ? JSON.parse(node.location) : node.location,
                     level: node.level.toNumber ? node.level.toNumber() : node.level,
                     confidence: node.confidence.toNumber ? node.confidence.toNumber() : node.confidence
                 };
            });

            res.json({
                success: true,
                data: activeThreats,
                count: activeThreats.length,
                timestamp: new Date().toISOString(),
            });
        } finally {
             await session.close();
        }
    } catch (err: any) {
         res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /api/threats/:id
 * Returns a single threat by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        if (!neo4jDriver) {
             throw new Error('Neo4j Driver not initialized');
        }
        const session = neo4jDriver.session();
        try {
            const result = await session.run('MATCH (t:Threat {id: $id}) RETURN t', { id: req.params.id });

            if (result.records.length === 0) {
                 res.status(404).json({
                    success: false,
                    error: 'Threat not found',
                    timestamp: new Date().toISOString(),
                });
                return;
            }

            const node = result.records[0].get('t').properties;
            const threat = {
                 ...node,
                 classification: node.type,
                 timestamp: node.firstDetected,
                 location: typeof node.location === 'string' ? JSON.parse(node.location) : node.location,
                 level: node.level.toNumber ? node.level.toNumber() : node.level,
                 confidence: node.confidence.toNumber ? node.confidence.toNumber() : node.confidence
            };

            res.json({
                success: true,
                data: threat,
                timestamp: new Date().toISOString(),
            });
        } finally {
            await session.close();
        }
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;