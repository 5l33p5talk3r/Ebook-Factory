# Security

## Production rules

- Never commit `.env` files, private keys, Firebase service-account JSON, or PayPal secrets.
- Server endpoints must verify Firebase ID tokens cryptographically before accessing creator or customer data.
- Product prices are authoritative on the server. Clients send product IDs, never trusted prices.
- Paid digital files must be delivered only after a verified completed payment and entitlement check.
- PayPal webhooks should be signature-verified and processed idempotently before production launch.
- Admin privileges must come from Firebase custom claims or an equivalent trusted identity source.
- Do not use mock reviews, fake sales counts, placeholder download URLs, or simulated publication IDs in production.
