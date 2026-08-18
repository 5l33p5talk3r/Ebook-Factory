import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { requireAdmin, requireAuth, type AuthenticatedRequest } from './server/auth';
import { apiRateLimit, requestSecurity } from './server/security';
import { ensureCustomer, createPendingOrder, fulfillCapturedOrder, getLibrary, getOrderProducts, getPublishedProducts } from './src/services/postgresCommerce';
import { getAuthorizedEbook } from './src/services/ebookDelivery';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 3000);
const allowedOrigins = (process.env.APP_ORIGIN || 'http://localhost:3000').split(',').map(v => v.trim()).filter(Boolean);
app.disable('x-powered-by');
app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : false);
app.use(requestSecurity);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', apiRateLimit());

app.get('/api/health', async (_req, res) => {
  try { const { getPool } = await import('./src/db/postgres'); await getPool().query('SELECT 1'); return res.json({ success: true, service: 'ebook-factory', status: 'healthy', database: 'healthy', timestamp: new Date().toISOString() }); }
  catch { return res.status(503).json({ success: false, service: 'ebook-factory', status: 'degraded', database: 'unavailable' }); }
});

app.get('/api/products', async (_req, res) => {
  try { return res.json({ success: true, products: await getPublishedProducts() }); }
  catch (error) { console.error(error); return res.status(503).json({ success: false, error: 'Product catalog unavailable.' }); }
});
app.get('/api/products/:id', async (req, res) => {
  try { return res.json({ success: true, product: (await getPublishedProducts([req.params.id]))[0] }); }
  catch { return res.status(404).json({ success: false, error: 'Product not found.' }); }
});
app.get('/api/library', requireAuth, async (req: AuthenticatedRequest, res) => {
  try { return res.json({ success: true, products: await getLibrary(req.user!.uid) }); }
  catch (error) { console.error(error); return res.status(503).json({ success: false, error: 'Customer library unavailable.' }); }
});

app.get('/api/library/:productId/download/:format', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const format = req.params.format === 'pdf' || req.params.format === 'epub' ? req.params.format : null;
    if (!format) return res.status(400).json({ success: false, error: 'Unsupported ebook format.' });
    const ebook = await getAuthorizedEbook(req.user!.uid, req.params.productId, format);
    if (!ebook) return res.status(404).json({ success: false, error: 'Ebook is not available for this account.' });
    res.setHeader('Content-Length', String(ebook.size));
    res.setHeader('Content-Disposition', `attachment; filename="${ebook.title.replace(/[^a-z0-9._ -]/gi, '_')}.${format}"`);
    res.setHeader('Cache-Control', 'private, no-store');
    return res.sendFile(ebook.filePath);
  } catch (error) { console.error(error); return res.status(404).json({ success: false, error: 'Ebook is not available.' }); }
});

app.post('/api/creator/project', requireAdmin, (req, res) => {
  const { title, niche } = req.body || {};
  if (typeof title !== 'string' || typeof niche !== 'string' || !title.trim() || !niche.trim()) return res.status(400).json({ success: false, error: 'Title and niche are required.' });
  return res.status(201).json({ success: true, project: { id: crypto.randomUUID(), title: title.trim(), niche: niche.trim(), status: 'draft', createdAt: new Date().toISOString() } });
});

function productIdsFromRequest(body: unknown) {
  const value = (body as { productIds?: unknown } | null)?.productIds;
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) return null;
  const ids = value.filter((id): id is string => typeof id === 'string' && id.length > 0);
  return ids.length === value.length ? [...new Set(ids)] : null;
}

app.post('/api/checkout/quote', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    await ensureCustomer(req.user!.uid, req.user!.email);
    const ids = productIdsFromRequest(req.body);
    if (!ids) return res.status(400).json({ success: false, error: 'A valid product selection is required.' });
    const products = await getPublishedProducts(ids);
    const totalCents = products.reduce((sum, product) => sum + product.price_cents, 0);
    return res.json({ success: true, currency: products[0]?.currency || 'USD', items: products.map(p => ({ id: p.id, title: p.title, price: (p.price_cents / 100).toFixed(2) })), total: (totalCents / 100).toFixed(2) });
  } catch (error) { console.error(error); return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unable to create quote.' }); }
});

app.post('/api/paypal/create-order', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    await ensureCustomer(req.user!.uid, req.user!.email);
    const { createPayPalOrder } = await import('./src/services/paypalServer');
    const ids = productIdsFromRequest(req.body);
    if (!ids) return res.status(400).json({ success: false, error: 'A valid product selection is required.' });
    const products = await getPublishedProducts(ids);
    const result = await createPayPalOrder(products.map(p => ({ id: p.id, title: p.title, price: p.price_cents / 100 })), req.user!.uid);
    const paypalOrderId = result.order?.id;
    if (typeof paypalOrderId !== 'string') throw new Error('PayPal did not return an order ID.');
    const checkout = await createPendingOrder(req.user!.uid, paypalOrderId, products);
    return res.json({ ...result, checkout });
  } catch (error) { console.error(error); return res.status(500).json({ success: false, error: 'Unable to create payment order.' }); }
});

app.post('/api/paypal/capture-order', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    await ensureCustomer(req.user!.uid, req.user!.email);
    const { capturePayPalOrder } = await import('./src/services/paypalServer');
    if (typeof req.body?.orderId !== 'string' || !/^[A-Za-z0-9_-]{10,80}$/.test(req.body.orderId.trim())) return res.status(400).json({ success: false, error: 'A valid PayPal order ID is required.' });
    const orderId = req.body.orderId.trim();
    const products = await getOrderProducts(req.user!.uid, orderId);
    const paypalResult = await capturePayPalOrder(orderId, req.user!.uid);
    if (!paypalResult.success) return res.status(409).json(paypalResult);
    const fulfillment = await fulfillCapturedOrder(req.user!.uid, orderId, paypalResult.order, products);
    return res.json({ ...paypalResult, fulfillment });
  } catch (error) { console.error(error); return res.status(500).json({ success: false, error: 'Unable to capture and fulfill payment.' }); }
});

app.post('/api/admin/publish', requireAdmin, (req, res) => {
  const { projectId, platforms } = req.body || {};
  if (typeof projectId !== 'string' || !projectId.trim() || !Array.isArray(platforms) || platforms.length === 0 || platforms.length > 10) return res.status(400).json({ success: false, error: 'Project ID and at least one platform are required.' });
  return res.status(202).json({ success: true, status: 'queued', jobId: crypto.randomUUID(), projectId: projectId.trim(), platforms });
});

async function start() {
  if (process.env.NODE_ENV !== 'production') { const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' }); app.use(vite.middlewares); }
  else { app.use(express.static(path.join(__dirname, 'dist'))); app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html'))); }
  app.listen(PORT, '0.0.0.0', () => console.log(`Ebook Factory running on port ${PORT}`));
}
start().catch(error => { console.error(error); process.exit(1); });