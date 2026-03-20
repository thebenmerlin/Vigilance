import neo4j, { Driver } from 'neo4j-driver';
import { Pool } from 'pg';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// ============================================================================
// PostgreSQL (TimescaleDB) Connection
// ============================================================================
export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:pass@postgres:5432/vigilance',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pgPool.on('error', (err) => {
  console.error('[Postgres] Unexpected error on idle client', err);
});

// ============================================================================
// Neo4j Connection
// ============================================================================
const neo4jUri = process.env.NEO4J_URI || 'bolt://neo4j:7687';
const neo4jUser = process.env.NEO4J_USER || 'neo4j';
const neo4jPassword = process.env.NEO4J_PASSWORD || 'secret';

let neo4jDriver: Driver | null = null;

try {
  neo4jDriver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPassword));
} catch (error) {
  console.error('[Neo4j] Failed to initialize driver:', error);
}

export { neo4jDriver };

// ============================================================================
// Redis Connection
// ============================================================================
export const redisClient = new Redis(process.env.REDIS_URL || 'redis://redis:6379', {
    retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
    }
});

redisClient.on('error', (err) => {
  console.error('[Redis] Connection Error:', err);
});

redisClient.on('connect', () => {
    console.log('[Redis] Connected to Redis instance');
});

// ============================================================================
// Database Initialization/Seeding (Helper)
// ============================================================================

export const initializeDatabases = async () => {
    // Basic connectivity checks to make sure we're up and running
    try {
        const client = await pgPool.connect();
        console.log('[Postgres] Connected to TimescaleDB');
        client.release();
    } catch (err: any) {
        console.warn(`[Postgres] Connection failed: ${err.message}`);
    }

    try {
        if (neo4jDriver) {
           const session = neo4jDriver.session();
           await session.run('RETURN 1');
           console.log('[Neo4j] Connected to Neo4j Graph Database');
           await session.close();
        }
    } catch (err: any) {
         console.warn(`[Neo4j] Connection failed: ${err.message}`);
    }
};