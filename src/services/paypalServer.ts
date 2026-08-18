type PayPalItem = { id: string; title: string; price: number };

type PayPalConfig = { clientId: string; clientSecret: string; baseUrl: string };
export type PayPalRuntimeConfig = {
  clientId: string;
  clientSecret: string;
  environment?: string;
};

function config(overrides?: PayPalRuntimeConfig): PayPalConfig {
  const clientId = overrides?.clientId ?? process.env.PAYPAL_CLIENT_ID;
  const clientSecret = overrides?.clientSecret ?? process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('PayPal credentials are not configured.');
  const environment = overrides?.environment ?? process.env.PAYPAL_ENVIRONMENT;
  return {
    clientId,
    clientSecret,
    baseUrl: environment === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com'
  };
}

function money(cents: number) {
  return (cents / 100).toFixed(2);
}

function priceToCents(price: number) {
  if (!Number.isFinite(price) || price < 0) throw new Error('Invalid product price.');
  return Math.round(price * 100);
}

async function accessToken(c: PayPalConfig) {
  const basic = typeof btoa === 'function'
    ? btoa(`${c.clientId}:${c.clientSecret}`)
    : Buffer.from(`${c.clientId}:${c.clientSecret}`).toString('base64');
  const response = await fetch(`${c.baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  if (!response.ok) throw new Error(`PayPal authentication failed: ${response.status}`);
  const data = await response.json() as { access_token?: string };
  if (!data.access_token) throw new Error('PayPal did not return an access token.');
  return data.access_token;
}

type CreateOrderArgs =
  | [items: PayPalItem[], customerId: string, runtime?: PayPalRuntimeConfig]
  | [clientId: string, clientSecret: string, environment: string, items: PayPalItem[], customerId?: string];

export async function createPayPalOrder(...args: CreateOrderArgs) {
  const [items, customerId, runtime] = typeof args[0] === 'string'
    ? [args[3], args[4] || 'guest', { clientId: args[0], clientSecret: args[1], environment: args[2] }] as const
    : args;

  if (!customerId || items.length === 0) throw new Error('Customer and products are required.');

  const c = config(runtime);
  const token = await accessToken(c);
  const totalCents = items.reduce((sum, item) => sum + priceToCents(item.price), 0);
  const referenceId = crypto.randomUUID();
  const productIds = items.map(item => item.id).join(',');

  const response = await fetch(`${c.baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': referenceId
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: referenceId,
        custom_id: customerId,
        description: `Ebook Factory digital products: ${productIds}`,
        amount: {
          currency_code: 'USD',
          value: money(totalCents),
          breakdown: { item_total: { currency_code: 'USD', value: money(totalCents) } }
        },
        items: items.map(item => ({
          name: item.title,
          sku: item.id,
          quantity: '1',
          unit_amount: { currency_code: 'USD', value: money(priceToCents(item.price)) },
          category: 'DIGITAL_GOODS'
        }))
      }]
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || 'PayPal order creation failed.');
  return { success: true, order: data };
}

type CaptureOrderArgs =
  | [orderId: string, customerId: string, runtime?: PayPalRuntimeConfig]
  | [clientId: string, clientSecret: string, environment: string, orderId: string, items: PayPalItem[], customerEmail?: string, customerName?: string];

export async function capturePayPalOrder(...args: CaptureOrderArgs) {
  const legacy = typeof args[0] === 'string' && typeof args[1] === 'string' && typeof args[2] === 'string' && typeof args[3] === 'string';
  const [orderId, customerId, runtime] = legacy
    ? [args[3], args[5] || 'guest', { clientId: args[0], clientSecret: args[1], environment: args[2] }] as const
    : args;

  if (!customerId) throw new Error('Authenticated customer is required.');

  const c = config(runtime);
  const token = await accessToken(c);
  const response = await fetch(`${c.baseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `capture-${orderId}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || 'PayPal capture failed.');

  if (data?.status !== 'COMPLETED') return { success: false, status: data?.status, order: data };

  const customId = data?.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id
    ?? data?.purchase_units?.[0]?.custom_id;
  if (customId && customId !== customerId) throw new Error('PayPal order does not belong to the authenticated customer.');

  return { success: true, status: 'COMPLETED', order: data };
}