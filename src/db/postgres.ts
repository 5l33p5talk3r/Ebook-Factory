import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool() {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not configured.');
  pool = new Pool({
    connectionString,
    max: Number(process.env.DB_POOL_MAX || 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
  });
  return pool;
}

export async function withTransaction<T>(fn: (client: pg.PoolClient) => Promise<T>) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function closePool() {
  if (!pool) return;
  await pool.end();
  pool = null;
}
