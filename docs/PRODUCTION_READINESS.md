# Ebook Factory — Production Readiness

## Business identity
- Brand: Ebook Factory
- Primary domain: ebookfactory.org
- Administrative contact: bishopn45@ebookfactory.org

## Release gates

### Security
- [x] Firebase ID tokens are cryptographically verified on protected routes.
- [x] Admin access is checked server-side.
- [x] Client-submitted prices are not trusted for checkout.
- [ ] PayPal webhook signatures are verified.
- [ ] Payment/order idempotency is persisted.
- [ ] Download authorization is enforced against persisted entitlements.
- [ ] Production secrets exist only in deployment secret storage.

### Commerce
- [x] Server-side product catalog exists.
- [x] PayPal order creation uses server-side prices.
- [x] PayPal capture is server-side.
- [ ] Successful captures create durable orders.
- [ ] Successful orders create durable customer entitlements.
- [ ] Refund/reversal handling is implemented.

### Publishing
- [ ] Ebook projects persist in the production database.
- [ ] Manuscript generation is persisted and resumable.
- [ ] PDF generation produces real files.
- [ ] EPUB generation produces real files.
- [ ] Generated assets are stored in durable object storage.
- [ ] Publishing jobs have durable status and retry handling.

### Storefront
- [ ] Product pages read from the production catalog.
- [ ] Ratings/reviews are real records or clearly omitted.
- [ ] Customer library reads from entitlements.
- [ ] Download links are authorized and time-limited.
- [ ] Checkout success/failure states are fully handled.

### Domain and operations
- [ ] ebookfactory.org points to the production frontend.
- [ ] www.ebookfactory.org redirects/canonicalizes to the primary domain.
- [ ] API endpoint is configured with HTTPS.
- [ ] Transactional email sender is configured.
- [ ] SPF/DKIM/DMARC are configured for ebookfactory.org.
- [ ] Privacy Policy, Terms, Refund Policy, and Contact pages are live.
- [ ] Monitoring and error reporting are enabled.

## Deployment rule

Do not advertise the service as production-ready until all unchecked release gates above are completed and an end-to-end test confirms:

`customer login → product selection → server quote → PayPal order → PayPal capture → persisted order → entitlement → authorized download`.
