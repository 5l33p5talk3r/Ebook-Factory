import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { PRODUCTS, getProduct } from './data/products';
import { requireAdmin, requireAuth, type AuthenticatedRequest } from './server/auth';
import { apiRateLimit, requestSecurity } from './server/security';

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

app.get('/api/health', (_req, res) => res.json({ success: true, service: 'ebook-factory', status: 'healthy', timestamp: new Date().toISOString() }));
app.get('/api/products', (_req, res) => res.json({ success: true, products: PRODUCTS }));
app.get('/api/products/:id', (req, res) => {
  const product = getProduct(req.params.id);
  if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
  return res.json({ success: true, product });
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

app.post('/api/checkout/quote', requireAuth, (req: AuthenticatedRequest, res) => {
  const ids = productIdsFromRequest(req.body);
  if (!ids) return res.status(400).json({ success: false, error: 'A valid product selection is required.' });
  const products = ids.map(id => getProduct(id));
  if (products.some(product => !product)) return res.status(400).json({ success: false, error: 'One or more products are invalid.' });
  const totalCents = products.reduce((sum, product) => sum + Math.round((product?.price || 0) * 100), 0);
  return res.json({ success: true, currency: 'USD', items: products.map(p => ({ id: p!.id, title: p!.title, price: p!.price })), total: (totalCents / 100).toFixed(2) });
});

app.post('/api/paypal/create-order', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { createPayPalOrder } = await import('./src/services/paypalServer');
    const ids = productIdsFromRequest(req.body);
    if (!ids) return res.status(400).json({ success: false, error: 'A valid product selection is required.' });
    const products = ids.map(id => getProduct(id));
    if (products.some(product => !product)) return res.status(400).json({ success: false, error: 'One or more products are invalid.' });
    const result = await createPayPalOrder(products.map(p => ({ id: p!.id, title: p!.title, price: p!.price })), req.user.uid);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Unable to create payment order.' });
  }
});

app.post('/api/paypal/capture-order', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { capturePayPalOrder } = await import('./src/services/paypalServer');
    if (typeof req.body?.orderId !== 'string' || !/^[A-Za-z0-9_-]{10,80}$/.test(req.body.orderId.trim())) return res.status(400).json({ success: false, error: 'A valid PayPal order ID is required.' });
    const result = await capturePayPalOrder(req.body.orderId.trim(), req.user.uid);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Unable to capture payment.' });
  }
});

app.post('/api/admin/publish', requireAdmin, (req, res) => {
  const { projectId, platforms } = req.body || {};
  if (typeof projectId !== 'string' || !projectId.trim() || !Array.isArray(platforms) || platforms.length === 0 || platforms.length > 10) return res.status(400).json({ success: false, error: 'Project ID and at least one platform are required.' });
  return res.status(202).json({ success: true, status: 'queued', jobId: crypto.randomUUID(), projectId: projectId.trim(), platforms });
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`Ebook Factory running on port ${PORT}`));
}

start().catch(error => { console.error(error); process.exit(1); });
