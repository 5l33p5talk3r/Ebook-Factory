# EbookFactory (Unified AI Ebook SaaS & Marketplace)

EbookFactory is a unified, production-ready AI publishing platform and SaaS marketplace that merges **NicheMaster** AI niche intelligence with an end-to-end ebook generation pipeline, cover design studio, and direct PayPal digital storefront sales.

---

## 🌟 Key Functional Areas

1. **Public Storefront & Marketplace Landing:**
   - Dark ink & warm gold editorial theme.
   - Category filtering, search, live metrics, and sample chapter reader preview modals.
   - Instant digital download delivery (PDF & EPUB).

2. **NicheMaster Intelligence Hub:**
   - Real-time AI market demand, search volume, and competition gap analysis.
   - Keyword clusters, target buyer personas, and competitor notes.
   - 5-point validation checklist and scored opportunity index.
   - **One-Click Project Creation**: Directly converts any validated niche concept into an active draft project.

3. **Creator Studio & Publishing Pipeline:**
   - Structured outline builder with custom chapter templates.
   - Chapter content generator backed by Google Search fact-checking grounding.
   - Full TipTap rich text editor with grammar checking, dictation, and auto-translation.
   - 3:4 High-Resolution AI Cover Generator.
   - Multi-format exports (EPUB, PDF, ZIP).

4. **Commerce & Entitlements:**
   - Production PayPal Orders API v2 integration with native Smart Buttons.
   - Authoritative server-side price validation and entitlement issuing upon verified payment capture.
   - PayPal Webhook endpoint (`/api/paypal/webhook`) with cryptographic signature verification.
   - Personal reader library view with sepia, light, and dark reader modes.

---

## 🛠️ Architecture & Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend Services:** Express (Local Dev) + Cloudflare Workers (`worker.ts` for Edge).
- **Database & Storage:** Firebase (Firestore/Auth) + Cloudflare D1 SQL Database (`migrations/0001_init.sql`).
- **AI Engine:** Google Gemini (`@google/genai`) with Search Grounding enabled.
- **Payment Processing:** PayPal Orders API v2 / `@paypal/react-paypal-js` (`paypalServer` service).

---

## 🚀 Environment Setup & PayPal Integration

Copy `.env.example` to `.env` and configure the required environment variables:

```env
# Gemini AI Key
GEMINI_API_KEY=your_gemini_api_key

# PayPal Integration Credentials
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_for_browser
PAYPAL_CLIENT_ID=your_paypal_client_id_for_server
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_for_server
PAYPAL_ENVIRONMENT=sandbox  # Use "sandbox" or "live"
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 💳 PayPal Orders API Setup Guide

1. **Create PayPal Developer App:**
   - Log in to the [PayPal Developer Dashboard](https://developer.paypal.com/).
   - Under **Apps & Credentials**, create a REST API app in **Sandbox** or **Live** mode.
   - Copy the **Client ID** and **Secret**.

2. **Configure Environment Variables:**
   - Set `VITE_PAYPAL_CLIENT_ID` to your Client ID (used by the browser JS SDK).
   - Set `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` in your server environment (used by `/api/paypal/*` endpoints).
   - Set `PAYPAL_ENVIRONMENT` to `sandbox` for testing or `live` for production.

3. **Register PayPal Webhook:**
   - In your PayPal Developer App settings, click **Add Webhook**.
   - Set the Webhook URL to: `https://your-app-domain.com/api/paypal/webhook`
   - Select events: `PAYMENT.CAPTURE.COMPLETED` and `CHECKOUT.ORDER.APPROVED`.
   - Copy the generated **Webhook ID** and set it as `PAYPAL_WEBHOOK_ID`.

---

## ☁️ Cloudflare Workers & D1 Deployment

For detailed Cloudflare deployment steps, see [`CLOUDFLARE_DEPLOY.md`](./CLOUDFLARE_DEPLOY.md).

Quick summary:
```bash
# 1. Create D1 Database
npx wrangler d1 create ebookfactory_db

# 2. Apply SQL Schema Migration
npx wrangler d1 execute ebookfactory_db --file=migrations/0001_init.sql

# 3. Deploy Worker
npx wrangler deploy
```

---

## 🔒 Security & Admin Access Control Model

EbookFactory uses a robust **Admin-Only Access Control Model** to ensure non-admins and public customers see **ONLY** the public Storefront and their personal Reader Library. All creator and admin capabilities (Niche Intelligence, Ebook Generation, Creator Studio, Chapter Editor, Cover Design, and Analytics) are strictly protected at both UI, Firestore, and backend server layers.

### 1. Verification & Role Model
- **Firebase Auth Custom Claim**: Verified Firebase ID token custom claim `admin === true`.
- **Firestore User Record**: Record at `users/{uid}` in Firestore containing `{ role: "admin" }`.
- **No Client Passkeys or Allowlists**: No hardcoded email allowlists, client-side passkey forms, or magic bypass tokens exist in the source code or rules.

### 2. Multi-Layer Enforcement
- **UI Route Guards**: Non-admin users attempting to navigate to `/creator` or `/niche` are automatically rendered an **Access Denied** screen with an option to return to the public Storefront.
- **Firestore Security Rules**: `/projects/{projectId}` and `/projects/{projectId}/chapters/{chapterId}` collections are strictly locked to `isAdmin()`. Standard clients are explicitly forbidden from setting or changing the `role` field on `users/{uid}` documents.
- **API Endpoint Middleware**: Protected backend endpoints (`/api/gemini/*`, `/api/publish`, `/api/convert`) in both local Express (`server.ts`) and Cloudflare Workers (`worker.ts`) inspect the Authorization Bearer ID Token for verified custom claims or admin roles. Unauthenticated or non-admin requests receive a `403 Forbidden` response.

### 3. Secure Bootstrap & Admin Provisioning Procedures

To provision the first administrator account, use one of the following secure server-side or console methods:

#### Option A: Firebase Admin SDK Script (Recommended)
Using a local or server-side script with `firebase-admin` service account credentials (stored safely in environment variables):

```javascript
// bootstrap-admin.js (Run server-side with admin credentials)
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  })
});

async function setAdminRole(targetUid) {
  // 1. Set Auth Custom Claim (validated in ID tokens)
  await admin.auth().setCustomUserClaims(targetUid, { admin: true });
  
  // 2. Set Firestore role document field (validated in Firestore rules)
  await admin.firestore().collection("users").doc(targetUid).set({
    role: "admin",
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  console.log(`Successfully granted admin privileges to UID: ${targetUid}`);
}

setAdminRole("TARGET_USER_UID");
```

#### Option B: Firebase Console (Firestore Data Manager)
1. Open the [Firebase Console](https://console.firebase.google.com/) for your project.
2. Navigate to **Firestore Database** -> `users` collection.
3. Select the target user's document (`users/{uid}`).
4. Set the field `role` (string) = `"admin"`.
5. Upon the user's next sign-in or session refresh, the Firestore rule and client subscription will recognize the administrator role.

---

## 📜 License

MIT License.
