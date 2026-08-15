export type D1DatabaseLike = {
  prepare(query: string): {
    bind(...values: unknown[]): any;
    first<T = unknown>(): Promise<T | null>;
    run(): Promise<unknown>;
    all<T = unknown>(): Promise<{ results: T[] }>;
  };
};

type ProductRow = { id: string; title: string; price_cents: number; currency: string; status: string };

type PayPalCapture = {
  id?: string;
  status?: string;
  purchase_units?: Array<{
    custom_id?: string;
    amount?: { currency_code?: string; value?: string };
    payments?: { captures?: Array<{ id?: string; status?: string; amount?: { currency_code?: string; value?: string } }> };
  }>;
};

const id = () => crypto.randomUUID();

export async function loadPublishedProducts(db: D1DatabaseLike, productIds: string[]) {
  if (!productIds.length) throw new Error('At least one product is required.');
  const placeholders = productIds.map(() => '?').join(',');
  const result = await db.prepare(
    `SELECT id,title,price_cents,currency,status FROM products WHERE id IN (${placeholders}) AND status = 'published'`
  ).bind(...productIds).all<ProductRow>();
  const products = result.results || [];
  if (products.length !== new Set(productIds).size) throw new Error('One or more products are unavailable.');
  return productIds.map(productId => products.find(p => p.id === productId)!);
}

export async function recordCompletedOrder(
  db: D1DatabaseLike,
  userId: string,
  paypalOrderId: string,
  capture: PayPalCapture,
  products: ProductRow[]
) {
  if (capture.status !== 'COMPLETED') throw new Error('PayPal transaction is not completed.');
  const captureUnit = capture.purchase_units?.[0];
  const paypalUser = captureUnit?.custom_id;
  if (paypalUser && paypalUser !== userId) throw new Error('PayPal customer does not match the authenticated customer.');

  const currency = captureUnit?.amount?.currency_code || products[0]?.currency || 'USD';
  const totalCents = products.reduce((sum, product) => sum + product.price_cents, 0);
  const orderId = id();
  const completedAt = new Date().toISOString();

  const existing = await db.prepare('SELECT id,status FROM orders WHERE paypal_order_id = ?').bind(paypalOrderId).first<{id:string;status:string}>();
  if (existing) {
    if (existing.status === 'completed') return { orderId: existing.id, alreadyRecorded: true };
    throw new Error('A conflicting order already exists for this PayPal transaction.');
  }

  await db.prepare(
    `INSERT INTO orders (id,user_id,paypal_order_id,status,total_cents,currency,created_at,completed_at)
     VALUES (?,?,?,?,?,?,?,?)`
  ).bind(orderId, userId, paypalOrderId, 'completed', totalCents, currency, completedAt, completedAt).run();

  for (const product of products) {
    await db.prepare(
      `INSERT INTO order_items (id,order_id,product_id,unit_price_cents,quantity) VALUES (?,?,?,?,1)`
    ).bind(id(), orderId, product.id, product.price_cents).run();

    await db.prepare(
      `INSERT INTO entitlements (id,user_id,product_id,order_id,status,granted_at)
       VALUES (?,?,?,?,'active',?)
       ON CONFLICT(user_id,product_id) DO UPDATE SET status='active', order_id=excluded.order_id, revoked_at=NULL`
    ).bind(id(), userId, product.id, orderId, completedAt).run();
  }

  return { orderId, alreadyRecorded: false };
}

export async function getCustomerLibrary(db: D1DatabaseLike, userId: string) {
  const result = await db.prepare(
    `SELECT p.id,p.title,p.slug,p.description,p.cover_url,p.pdf_key,p.epub_key,e.granted_at
     FROM entitlements e JOIN products p ON p.id=e.product_id
     WHERE e.user_id=? AND e.status='active' AND p.status='published'
     ORDER BY e.granted_at DESC`
  ).bind(userId).all();
  return result.results || [];
}
