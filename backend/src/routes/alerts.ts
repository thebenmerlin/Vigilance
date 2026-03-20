import { Router, Request, Response } from 'express';
import { pgPool } from '../data/db/index.js';
import { Alert } from '../data/mockData.js'; // Keep for types

const router = Router();

/**
 * GET /api/alerts
 * Returns paginated alerts list
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const priority = req.query.priority as string;
        const startIndex = (page - 1) * limit;

        const client = await pgPool.connect();
        try {
            let countQuery = 'SELECT COUNT(*) FROM alerts';
            let selectQuery = 'SELECT * FROM alerts ORDER BY timestamp DESC LIMIT $1 OFFSET $2';
            let countParams: any[] = [];
            let selectParams: any[] = [limit, startIndex];

            if (priority) {
                countQuery += ' WHERE priority = $1';
                selectQuery = 'SELECT * FROM alerts WHERE priority = $3 ORDER BY timestamp DESC LIMIT $1 OFFSET $2';
                countParams = [priority];
                selectParams = [limit, startIndex, priority];
            }

            const countResult = await client.query(countQuery, countParams);
            const totalItems = parseInt(countResult.rows[0].count);

            const selectResult = await client.query(selectQuery, selectParams);
            const alerts = selectResult.rows.map(row => {
                 const loc = typeof row.location === 'string' ? JSON.parse(row.location) : row.location;
                 return {
                     ...row,
                     title: row.type, // map DB type to frontend title
                     sector: loc?.sector || 'Unknown Sector', // map DB location to frontend sector
                     location: loc
                 };
            });

            res.json({
                success: true,
                data: alerts,
                pagination: {
                    page,
                    pageSize: limit,
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit),
                },
                timestamp: new Date().toISOString(),
            });
        } finally {
            client.release();
        }
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /api/alerts/:id
 * Returns a single alert by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const client = await pgPool.connect();
        try {
            const result = await client.query('SELECT * FROM alerts WHERE id = $1', [req.params.id]);
            if (result.rows.length === 0) {
                 res.status(404).json({
                    success: false,
                    error: 'Alert not found',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            const row = result.rows[0];
            const loc = typeof row.location === 'string' ? JSON.parse(row.location) : row.location;
            const alert = {
                ...row,
                title: row.type,
                sector: loc?.sector || 'Unknown Sector',
                location: loc
            };

            res.json({
                success: true,
                data: alert,
                timestamp: new Date().toISOString(),
            });
        } finally {
            client.release();
        }
    } catch (err: any) {
         res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * PATCH /api/alerts/:id/acknowledge
 * Acknowledge an alert
 */
router.patch('/:id/acknowledge', async (req: Request, res: Response) => {
    try {
         const client = await pgPool.connect();
         try {
             const result = await client.query(
                 'UPDATE alerts SET status = $1 WHERE id = $2 RETURNING *',
                 ['acknowledged', req.params.id]
             );

             if (result.rows.length === 0) {
                 res.status(404).json({
                     success: false,
                     error: 'Alert not found',
                     timestamp: new Date().toISOString(),
                 });
                 return;
             }

             const row = result.rows[0];
             const loc = typeof row.location === 'string' ? JSON.parse(row.location) : row.location;
             const alert = {
                 ...row,
                 title: row.type,
                 sector: loc?.sector || 'Unknown Sector',
                 location: loc
             };

             res.json({
                 success: true,
                 data: alert,
                 message: 'Alert acknowledged successfully',
                 timestamp: new Date().toISOString(),
             });
         } finally {
             client.release();
         }
    } catch (err: any) {
         res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Add a new alert (used by alert simulator)
 * (Actually, we insert it to Postgres)
 */
export async function addAlert(alert: Alert): Promise<void> {
    try {
        const client = await pgPool.connect();
        try {
            await client.query(
                `INSERT INTO alerts (id, type, priority, message, source, timestamp, status, location)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [alert.id, alert.title, alert.priority, alert.message, alert.source, alert.timestamp, alert.status, JSON.stringify({ sector: alert.sector })]
            );

            // Limit checks - keeping it small for demo (delete older than 100)
            const countRes = await client.query('SELECT COUNT(*) FROM alerts');
            if (parseInt(countRes.rows[0].count) > 100) {
                 await client.query(`
                     DELETE FROM alerts WHERE id IN (
                        SELECT id FROM alerts ORDER BY timestamp ASC LIMIT 1
                     )
                 `);
            }
        } finally {
            client.release();
        }
    } catch (err: any) {
        console.error('[addAlert] Error inserting mock alert:', err.message);
    }
}

export default router;