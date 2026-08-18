import type pg from 'pg';
import { getPool, withTransaction } from '../db/postgres';

export type DbProduct = { id: string; title: string; slug: string; description: string; price_cents: number; currency: string; cover_url: string | null; pdf_key: string | null; epub_key: string | null };

export async function ensureCustomer(userId: string, email?: string) {
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO users (id,email) VALUES ($1,$2)
     ON CONFLICT (id) DO UPDATE SET email=COALESCE(NULLIF(EXCLUDED.email,''),users.email), updated_at=now()
     RETURNING id,email`,
    [userId, email || `${userId}@local.invalid`]
  );
  return result.rows[0];
}

export async function getPublishedProducts(ids?: string[]) {
  const pool = getPool();
  if (ids?.length) {
    const result = await pool.query<DbProduct>(
      `SELECT id,title,slug,description,price_cents,currency,cover_url,pdf_key,epub_key
       FROM products WHERE status='published' AND id = ANY($1::text[]) ORDER BY array_position($1::text[],id)`, [ids]
    );
    if (result.rows.length !== new Set(ids).size) throw new Error('One or more products are unavailable.');
    return result.rows;
  }
  const result = await pool.query<DbProduct>(
    `SELECT id,title,slug,description,price_cents,currency,cover_url,pdf_key,epub_key FROM products WHERE status='published' ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function fulfillCapturedOrder(userId: string, paypalOrderId: string, capture: any, products: DbProduct[]) {
  if (capture?.status !== 'COMPLETED') throw new Error('PayPal transaction is not completed.');
  const paypalCustomer = capture?.purchase_units?.[0]?.custom_id;
  if (paypalCustomer && paypalCustomer !== userId) throw new Error('PayPal customer does not match authenticated customer.');
  const totalCents = products.reduce((sum, p) => sum + p.price_cents, 0);
  const currency = products[0]?.currency || 'USD';

  return withTransaction(async (client: pg.PoolClient) => {
    const existing = await client.query<{id:string;status:string}>(`SELECT id,status FROM orders WHERE paypal_order_id=$1 FOR UPDATE`, [paypalOrderId]);
    if (existing.rows[0]) {
      if (existing.rows[0].status === 'completed') return { orderId: existing.rows[0].id, alreadyRecorded: true };
      throw new Error('A conflicting order already exists for this PayPal transaction.');
    }
    const order = await client.query<{id:string}>(
      `INSERT INTO orders (id,user_id,paypal_order_id,status,total_cents,currency,completed_at) VALUES (gen_random_uuid()::text,$1,$2,'completed',$3,$4,now()) RETURNING id`,
      [userId, paypalOrderId, totalCents, currency]
    );
    const orderId = order.rows[0].id;
    for (const product of products) {
      await client.query(`INSERT INTO order_items (id,order_id,product_id,unit_price_cents,quantity) VALUES (gen_random_uuid()::text,$1,$2,$3,1)`, [orderId, product.id, product.price_cents]);
      await client.query(
        `INSERT INTO entitlements (id,user_id,product_id,order_id,status,granted_at) VALUES (gen_random_uuid()::text,$1,$2,$3,'active',now())
         ON CONFLICT (user_id,product_id) DO UPDATE SET status='active',order_id=EXCLUDED.order_id,revoked_at=NULL`,
        [userId, product.id, orderId]
      );
    }
    return { orderId, alreadyRecorded: false };
  });
}

export async function getLibrary(userId: string) {
  const result = await getPool().query(
    `SELECT p.id,p.title,p.slug,p.description,p.cover_url,p.pdf_key,p.epub_key,e.granted_at
     FROM entitlements e JOIN products p ON p.id=e.product_id
     WHERE e.user_id=$1 AND e.status='active' AND p.status='published' ORDER BY e.granted_at DESC`, [userId]
  );
  return result.rows;
}
