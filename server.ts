import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { PRODUCTS, getProduct } from './data/products';
import { requireAdmin, requireAuth, type AuthenticatedRequest } from './server/auth';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 3000);

app.disable('x-powered-by');
app.use(cors({ origin: process.env.APP_ORIGIN?.split(',').map(v => v.trim()) || true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ success: true, service: 'ebook-factory', status: 'healthy', timestamp: new Date().toISOString() }));
app.get('/api/products', (_req, res) => res.json({ success: true, products: PRODUCTS }));
app.get('/api/products/:id', (req, res) => {
  const product = getProduct(req.params.id);
  if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
  return res.json({ success: true, product });
});

// All creator/AI operations require a cryptographically verified Firebase ID token.
app.post('/api/creator/project', requireAdmin, (req, res) => {
  const { title, niche } = req.body || {};
  if (!title || !niche) return res.status(400).json({ success: false, error: 'Title and niche are required.' });
  return res.status(201).json({ success: true, project: { id: crypto.randomUUID(), title, niche, status: 'draft', createdAt: new Date().toISOString() } });
});

// Checkout accepts product IDs only. Prices are always read from the server catalog.
app.post('/api/checkout/quote', requireAuth, (req: AuthenticatedRequest, res) => {
  const ids = Array.isArray(req.body?.productIds) ? req.body.productIds : [];
  const products = ids.map((id: string) => getProduct(id)).filter(Boolean);
  if (!products.length || products.length !== ids.length) return res.status(400).json({ success: false, error: 'One or more products are invalid.' });
  const total = products.reduce((sum, product) => sum + (product?.price || 0), 0);
  return res.json({ success: true, currency: 'USD', items: products.map(p => ({ id: p!.id, title: p!.title, price: p!.price })), total: Number(total.toFixed(2)) });
});

// PayPal order creation is intentionally delegated to a verified server-side commerce service.
app.post('/api/paypal/create-order', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { createPayPalOrder } = await import('./src/services/paypalServer');
    const ids = Array.isArray(req.body?.productIds) ? req.body.productIds : [];
    const products = ids.map((id: string) => getProduct(id)).filter(Boolean);
    if (!products.length || products.length !== ids.length) return res.status(400).json({ success: false, error: 'Invalid product selection.' });
    const result = await createPayPalOrder(products.map(p => ({ id: p!.id, title: p!.title, price: p!.price })));
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Unable to create payment order.' });
  }
});

app.post('/api/paypal/capture-order', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { capturePayPalOrder } = await import('./src/services/paypalServer');
    if (!req.body?.orderId) return res.status(400).json({ success: false, error: 'PayPal order ID is required.' });
    const result = await capturePayPalOrder(req.body.orderId);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Unable to capture payment.' });
  }
});

app.post('/api/admin/publish', requireAdmin, (req, res) => {
  const { projectId, platforms } = req.body || {};
  if (!projectId || !Array.isArray(platforms) || platforms.length === 0) return res.status(400).json({ success: false, error: 'Project ID and at least one platform are required.' });
  return res.status(202).json({ success: true, status: 'queued', jobId: crypto.randomUUID(), projectId, platforms });
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
