# Optivio AI

Optivio AI is a MERN SaaS workspace for SEO audits, keyword tracking, competitor checks, AI recommendations, reports, notifications, teams, billing, and account management.

The app uses a Vite React client, an Express API, MongoDB through Mongoose, cookie/JWT authentication, and xAI Grok for generated SEO recommendations. If Grok is not configured or its request fails, audits still complete with local heuristic recommendations.

## Features

- User registration, login, logout, refresh tokens, password reset, Google OAuth, and optional SSO redirect.
- Website workspaces with domain validation and protected ownership checks.
- SEO audits with metadata checks, heading count, image alt coverage, internal/external links, broken link sampling, PageSpeed metrics, and audit history.
- Grok-powered recommendations through the xAI API.
- AI-powered ad copy generation for Google Ads, Facebook, Instagram, LinkedIn, and email campaigns with multiple tone options, CTA suggestions, headline generation, audience targeting hints, and platform-specific optimized marketing content.
- Keyword analysis and keyword suggestion estimates.
- Competitor comparison against saved competitor domains.
- Exportable SEO reports in JSON, CSV, PDF, and printable HTML.
- Notifications, team invitations, billing checkout hooks, and admin overview.
- Security headers, request rate limiting, HTTP-only auth cookies, and production-ready CORS configuration.

## Tech Stack

- Frontend: React 19, Vite 8, Tailwind CSS 4, Axios, React Router, Recharts.
- Backend: Node.js, Express 5, Mongoose 9, JWT, bcrypt.
- Database: MongoDB.
- AI provider: xAI Grok chat completions API.
- Optional services: Google PageSpeed Insights, Google OAuth, Resend or SendGrid, Stripe.

## Project Structure

```text
Optivio AI/
  client/        Vite React frontend
  server/        Express API, models, routes, controllers, services
  README.md      Project setup and deployment guide
```

## Prerequisites

- Node.js 20 or newer.
- npm.
- MongoDB local instance or MongoDB Atlas connection string.
- xAI API key for Grok recommendations.

## Environment Setup

Create the server env file:

```bash
cd server
cp .env.example .env
```

Required server variables:

```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017
CORS_ORIGIN=http://localhost:5173
CLIENT_URL=http://localhost:5173
ACCESS_TOKEN_SECRET=replace_with_a_long_random_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=replace_with_another_long_random_secret
REFRESH_TOKEN_EXPIRY=10d
XAI_API_KEY=your_xai_key
XAI_MODEL=grok-4.3
```

Create the client env file:

```bash
cd client
cp .env.example .env
```

Client variables:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=
```

For deployment, set `CORS_ORIGIN` to the deployed client URL. Multiple origins are supported with commas:

```env
CORS_ORIGIN=https://your-app.vercel.app,https://www.yourdomain.com
CLIENT_URL=https://your-app.vercel.app
```

## Running Locally

Install and start the API:

```bash
cd server
npm install
npm run dev
```

Install and start the client:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## Scripts

Server:

```bash
npm run dev      # start API with nodemon
npm start        # start API for production
npm test         # run Node test suite
```

Client:

```bash
npm run dev      # start Vite dev server
npm run build    # create production build
npm run lint     # run ESLint
npm run preview  # preview production build
```

## API Overview

All protected routes use the `/api/v1` prefix and require a valid session cookie or bearer token.

- `POST /users/register`
- `POST /users/login`
- `POST /users/logout`
- `POST /users/refresh-token`
- `GET /users/current-user`
- `PATCH /users/change-password`
- `PATCH /users/update-details`
- `POST /users/forgot-password`
- `POST /users/reset-password`
- `POST /users/oauth/google`
- `GET /users/sso/login`
- `GET|POST /websites`
- `PATCH|DELETE /websites/:websiteId`
- `GET|POST /websites/:websiteId/audits`
- `GET /websites/:websiteId/competitors`
- `GET /websites/:websiteId/export?format=json|csv|pdf|html`
- `GET|POST /keywords`
- `GET /keywords/suggestions`
- `DELETE /keywords/:keywordId`
- `GET /notifications`
- `PATCH /notifications/read-all`
- `PATCH /notifications/:notificationId/read`
- `DELETE /notifications/:notificationId`
- `GET|POST /teams`
- `POST /teams/:teamId/invite`
- `DELETE /teams/:teamId/members/:email`
- `POST /billing/checkout`
- `GET /billing/history`
- `GET /admin/overview`

## Grok Integration

SEO audits call `server/src/services/grok.service.js` after local audit metrics are collected. The service sends a chat-completions request to `https://api.x.ai/v1/chat/completions` with `XAI_API_KEY` and `XAI_MODEL`.

The response is normalized into four recommendation strings. If the key is missing, the API is unavailable, or the response cannot be parsed, the server falls back to built-in heuristic recommendations so the user workflow does not break.

xAI docs: https://docs.x.ai/developers/model-capabilities/legacy/chat-completions

## Deployment Checklist

1. Create production MongoDB database and set `MONGO_URL`.
2. Generate long random JWT secrets for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`.
3. Set `NODE_ENV=production`.
4. Set `CLIENT_URL` and `CORS_ORIGIN` to the deployed frontend URL.
5. Set `XAI_API_KEY` and choose `XAI_MODEL`.
6. Configure optional production services:
   - `PAGESPEED_API_KEY` for Google PageSpeed quota.
   - `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID` for Google login.
   - `RESEND_API_KEY` or `SENDGRID_API_KEY` for password reset email.
   - `STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID`, and `STRIPE_ENTERPRISE_PRICE_ID` for real checkout.
7. Run `npm test` in `server`.
8. Run `npm run lint` and `npm run build` in `client`.
9. Deploy the API first, then set `VITE_API_URL` in the client to the API origin.

## Suggested Hosting

- Client: Vercel, Netlify, or Render static site.
- Server: Render, Railway, Fly.io, or a Node-capable VPS.
- Database: MongoDB Atlas.

For cookie auth across different domains, the server already sets `secure: true` and `sameSite: "none"` when `NODE_ENV=production`. Make sure the API runs on HTTPS in production.

## Current Production Notes

- The audit engine performs live public website fetches, DNS checks, PageSpeed calls, and a small broken-link sample. Very large sites should eventually move audits to a background queue.
- Keyword metrics are deterministic estimates, not data from a paid keyword provider.
- Billing can mock checkout in development. Production should use Stripe price IDs.
- Admin access depends on a user document with `role: "admin"`.
- The rate limiter is in-memory, which is fine for a single server instance. For multiple instances, move rate-limit state to Redis or another shared store.

## Verification

Before shipping:

```bash
cd server
npm test

cd ../client
npm run lint
npm run build
```
