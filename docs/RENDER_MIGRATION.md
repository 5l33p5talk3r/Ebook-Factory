# Ebook Factory — Render migration

Ebook Factory is moving from Cloudflare-specific infrastructure to a conventional Node deployment on Render.

## Target architecture

- Render Web Service: Express + Vite production application
- PostgreSQL: durable users, products, orders, order items, entitlements, projects, jobs
- Object storage: private ebook files; application issues authorized downloads
- PayPal: server-side checkout/capture
- Northwest Registered Agent: domain registration/DNS
- `ebookfactory.org`: production application domain
- `bishopn45@ebookfactory.org`: business email; leave existing mail records untouched during web migration

## DNS cutover

Do not change DNS until the Render service is deployed and Render provides the exact custom-domain DNS target. Preserve existing MX records for email. Add/replace only the web records required by Render.

## Required Render environment variables

- `NODE_ENV=production`
- `PUBLIC_BASE_URL=https://ebookfactory.org`
- `DATABASE_URL=<Render PostgreSQL connection string>`
- `SESSION_SECRET=<random secret>`
- `PAYPAL_ENVIRONMENT=sandbox` initially, then `live`
- `PAYPAL_CLIENT_ID=<secret>`
- `PAYPAL_CLIENT_SECRET=<secret>`

Never commit credential values to Git.

## Migration rule

Cloudflare DNS, Pages, Workers, D1, KV, and Wrangler configuration must not be used by the production application. Existing Cloudflare files should be removed only after equivalent PostgreSQL, file storage, deployment, and health-check paths have been implemented and verified.
