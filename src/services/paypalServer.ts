type PayPalItem = { id: string; title: string; price: number };

type PayPalConfig = { clientId: string; clientSecret: string; baseUrl: string };

function config(): PayPalConfig {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('PayPal credentials are not configured.');
  return { clientId, clientSecret, baseUrl: process.env.PAYPAL_ENVIRONMENT === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com' };
}

async function accessToken(c: PayPalConfig) {
  const response = await fetch(`${c.baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`${c.clientId}:${c.clientSecret}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  });
  if (!response.ok) throw new Error(`PayPal authentication failed: ${response.status}`);
  return (await response.json() as { access_token: string }).access_token;
}

export async function createPayPalOrder(items: PayPalItem[]) {
  const c = config();
  const token = await accessToken(c);
  const total = items.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  const response = await fetch(`${c.baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ reference_id: crypto.randomUUID(), amount: { currency_code: 'USD', value: total, breakdown: { item_total: { currency_code: 'USD', value: total } } }, items: items.map(item => ({ name: item.title, sku: item.id, quantity: '1', unit_amount: { currency_code: 'USD', value: item.price.toFixed(2) }, category: 'DIGITAL_GOODS' })) }] })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || 'PayPal order creation failed.');
  return { success: true, order: data };
}

export async function capturePayPalOrder(orderId: string) {
  const c = config();
  const token = await accessToken(c);
  const response = await fetch(`${c.baseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || 'PayPal capture failed.');
  const status = data?.status;
  if (status !== 'COMPLETED') return { success: false, status, order: data };
  return { success: true, status: 'COMPLETED', order: data };
}
