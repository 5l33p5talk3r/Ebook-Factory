# Ebook Factory

Ebook Factory is an AI-assisted digital publishing platform for researching opportunities, producing ebooks, packaging digital products, and selling them through a controlled storefront.

## Product

- **Niche Intelligence** — evaluate publishing opportunities and buyer intent.
- **Creator Studio** — move from idea to outline, manuscript, cover, review, and release.
- **Storefront** — professional catalog and checkout experience.
- **Customer Library** — authenticated buyers access products they actually own.
- **Commerce** — PayPal order creation and capture are performed server-side.
- **Security** — Firebase ID tokens are cryptographically verified on protected endpoints.

## Architecture

```text
React + Vite
    │
    ├── Public Storefront
    ├── Customer Library
    └── Creator/Admin Studio
            │
            ▼
        Express API
            │
      ┌─────┼──────────┐
      ▼     ▼          ▼
   Firebase PayPal   Storage/DB
     Auth   Commerce   (production)
```

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Node.js 20+ is required.

## Production requirements

Configure Firebase Admin credentials and PayPal live credentials in the hosting environment. Never commit secrets. Product prices must remain authoritative on the server. Paid files must live outside the public application bundle and be delivered only after a verified completed payment and entitlement check. PayPal webhook signature verification and idempotent entitlement processing must be enabled before live launch.

## Important

The legacy repository contains demo-era UI/data and Cloudflare scaffolding. The `production-hardening` branch is the controlled modernization path. Mock sales, placeholder downloads, fake publication IDs, and client-trusted prices are not acceptable for production commerce.

## License

Proprietary — Ebook Factory.
