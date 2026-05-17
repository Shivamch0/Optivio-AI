# Optivio AI Production Setup

Optivio AI is now an MVP-grade MERN SaaS with production-ready integration points.

## Implemented

- JWT auth with refresh tokens and protected routes.
- Website add, edit, delete, and active/inactive status.
- Real HTML SEO audit attempt with fallback metrics.
- Title, meta description, H1, image alt, link, broken-link, and keyword-density analysis.
- Optional Google PageSpeed integration.
- Optional OpenAI or Gemini recommendations.
- Keyword tracking and keyword suggestions.
- Competitor comparison.
- Notifications API and UI.
- PDF, CSV, JSON, and HTML report exports.
- Profile, password change, forgot/reset password.
- Email-provider hooks for Resend and SendGrid.
- Google ID-token login endpoint and SSO redirect endpoint.
- Billing checkout foundation with Stripe Checkout support and development mock mode.
- Team workspaces, invitations, member roles.
- Admin overview endpoint and admin UI.
- Rate limiting and security headers.
- Recharts dashboard trend chart.
- Basic Node test suite.

## Environment

Copy examples before running:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Required minimum server values:

```bash
MONGO_URL=mongodb://127.0.0.1:27017
ACCESS_TOKEN_SECRET=replace-me
REFRESH_TOKEN_SECRET=replace-me-too
CORS_ORIGIN=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

Optional production integrations:

- `PAGESPEED_API_KEY` for Google PageSpeed.
- `OPENAI_API_KEY` or `GEMINI_API_KEY` for AI SEO suggestions.
- `RESEND_API_KEY` or `SENDGRID_API_KEY` for password reset emails.
- `GOOGLE_CLIENT_ID` for Google ID-token login.
- `SSO_LOGIN_URL` for external SSO redirect.
- `STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID`, `STRIPE_ENTERPRISE_PRICE_ID` for billing.

## Run Locally

```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

## Verify

```bash
cd server
npm test
```

```bash
cd client
npm run lint
npm run build
```

## Remaining Real-World Work

- Replace generated keyword metrics with a paid SEO data provider.
- Add a full Google Identity Services frontend flow instead of developer token paste.
- Add Stripe webhook handling to finalize subscription state.
- Send actual team invitation emails.
- Add frontend unit/integration tests.
- Add deployment files for your chosen host.
