import { pgPool, neo4jDriver, redisClient } from './index.js';
import { MOCK_ALERTS, MOCK_THREATS, MOCK_SENSORS } from '../mockData.js';
import { PoolClient } from 'pg';

/**
 * Ensures Timescale and Graph schemas are present.
 * Also seeds data if tables are empty.
 */
export async function seedDatabases() {
    try {
        console.log('[Seed] Starting database schemas and seed...');

        // --- 1. POSTGRESQL (Alerts and Sensors) ---
        const pgClient: PoolClient = await pgPool.connect();
        try {
            // Schemas
            await pgClient.query(`
                CREATE TABLE IF NOT EXISTS sensors (
                    id VARCHAR(50) PRIMARY KEY,
                    type VARCHAR(50) NOT null,
                    status VARCHAR(20) NOT null,
                    location JSONB,
                    last_reading JSONB,
                    battery_level INT,
                    last_seen TIMESTAMP NOT null
                );
            `);

            await pgClient.query(`
                CREATE TABLE IF NOT EXISTS alerts (
                    id VARCHAR(50) PRIMARY KEY,
                    type VARCHAR(50) NOT null,
                    priority VARCHAR(20) NOT null,
                    message TEXT NOT null,
                    source VARCHAR(50) NOT null,
                    timestamp TIMESTAMP NOT null,
                    status VARCHAR(20) NOT null,
                    location JSONB
                );
            `);

            // Seed Sensors
            const sensorCountResult = await pgClient.query('SELECT COUNT(*) FROM sensors');
            if (parseInt(sensorCountResult.rows[0].count) === 0) {
                console.log('[Seed] Seeding PostgreSQL sensors table...');
                for (const s of MOCK_SENSORS) {
                    await pgClient.query(
                        `INSERT INTO sensors (id, type, status, location, last_reading, battery_level, last_seen)
                         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                        [s.id, s.type, s.status, JSON.stringify(s.location), JSON.stringify({ ping: s.lastPing }), 100, s.lastPing]
                    );
                }
            }

            // Seed Alerts
            const alertCountResult = await pgClient.query('SELECT COUNT(*) FROM alerts');
            if (parseInt(alertCountResult.rows[0].count) === 0) {
                 console.log('[Seed] Seeding PostgreSQL alerts table...');
                 for (const a of MOCK_ALERTS) {
                     await pgClient.query(
                         `INSERT INTO alerts (id, type, priority, message, source, timestamp, status, location)
                          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                         [a.id, a.title, a.priority, a.message, a.source, a.timestamp, a.status, JSON.stringify({ sector: a.sector })]
                     );
                 }
            }

        } finally {
            pgClient.release();
        }

        // --- 2. NEO4J (Threats Graph) ---
        if (neo4jDriver) {
            const session = neo4jDriver.session();
            try {
                // Check if threats exist
                const countResult = await session.run('MATCH (t:Threat) RETURN COUNT(t) AS count');
                const threatCount = countResult.records[0].get('count').toNumber();

                if (threatCount === 0) {
                     console.log('[Seed] Seeding Neo4j threats graph...');
                     for (const t of MOCK_THREATS) {
                         await session.run(`
                            CREATE (t:Threat {
                                id: $id,
                                type: $type,
                                level: $level,
                                confidence: $confidence,
                                location: $location,
                                firstDetected: $firstDetected,
                                lastUpdated: $lastUpdated,
                                isActive: $isActive
                            })
                         `, {
                             id: t.id,
                             type: t.classification,
                             level: t.level,
                             confidence: t.confidence,
                             location: JSON.stringify(t.location),
                             firstDetected: t.timestamp,
                             lastUpdated: t.timestamp,
                             isActive: t.isActive
                         });
                         // (Additional relationships or metadata could go here)
                     }
                }
            } finally {
                await session.close();
            }
        }

        // --- 3. REDIS (Status & Cache) ---
        // Just checking connection implicitly, maybe seeding a few operational values
        const sysStatus = await redisClient.get('system_status');
        if (!sysStatus) {
            await redisClient.set('system_status', JSON.stringify({ status: 'operational', timestamp: new Date().toISOString() }));
        }

        console.log('[Seed] Database schemas and seed completed successfully.');
    } catch (err) {
        console.error('[Seed] Database seed error:', err);
    }
}
