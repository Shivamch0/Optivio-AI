Optivio AI

Optivio AI is a full-stack AI-powered SaaS platform built using the MERN stack.
It helps businesses improve their online presence through SEO audits, keyword analysis, competitor tracking, AI recommendations, and AI-powered marketing campaign generation.

The platform combines SEO intelligence with AI marketing automation, allowing users to generate optimized ad copies, manage campaigns, export reports, and monitor website performance from a single dashboard.

Features
Authentication & User Management
User registration and login
JWT authentication with refresh tokens
Secure HTTP-only cookie sessions
Password reset functionality
Google OAuth login
Optional SSO login support
Role-based access control (Admin/User)
Website & SEO Management
Website workspace creation
Domain validation
Protected ownership checks
SEO audits with detailed metrics
Audit history tracking
Competitor analysis
Keyword tracking and suggestions
Exportable SEO reports
SEO Audit Engine

The SEO audit system analyzes websites for:

Meta title optimization
Meta description quality
Heading structure (H1-H6)
Image alt coverage
Internal links
External links
Broken links
PageSpeed performance
Mobile responsiveness indicators
SEO scoring system
AI-Powered Recommendations

Optivio AI uses AI providers like:

xAI Grok
OpenAI
Google Gemini

to generate:

SEO improvement suggestions
Website optimization recommendations
AI-generated ad copies
Marketing campaign content

If external AI APIs fail, the system automatically falls back to local heuristic recommendations.

🚀 NEW FEATURE — AI Marketing Studio

Optivio AI now includes a complete Marketing Studio for AI-powered ad campaign generation and campaign management.

The Marketing Studio transforms Optivio AI into a complete digital marketing workspace.

Marketing Studio Features
AI Ad Copy Generation

Generate high-converting marketing content for:

Google Ads
Facebook Ads
Instagram Ads
LinkedIn Promotions
Product Marketing
Brand Awareness Campaigns
CTA-focused Advertisements

The AI generates content based on:

Business name
Product/service description
Target audience
Campaign goal
Tone and style
Selected platform
Campaign Management

Users can:

Create campaigns
Save ad copies
Regenerate content variations
Retrieve previous campaigns
Manage campaign history
Export campaigns as PDF files
Multi-AI Provider Architecture

The Marketing Studio integrates:

OpenAI
Google Gemini

Benefits:

Better content quality
Fallback support
Faster generation reliability
Diverse content generation
Tech Stack
Frontend
React 19
Vite 8
Tailwind CSS 4
Axios
React Router
Recharts
Backend
Node.js
Express 5
MongoDB
Mongoose
JWT Authentication
bcrypt
OpenAI API
Google Gemini API
xAI Grok API
Database
MongoDB Atlas / Local MongoDB
Project Structure
Optivio AI/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MarketingStudio.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   │
│   │   ├── routes/
│   │   ├── services/
│   │   └── Redux/
│   │
│   └── public/
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── campaign.controller.js
│   │   │   ├── audit.controller.js
│   │   │   └── user.controller.js
│   │   │
│   │   ├── models/
│   │   │   ├── campaign.model.js
│   │   │   ├── user.model.js
│   │   │   └── website.model.js
│   │   │
│   │   ├── routes/
│   │   │   ├── campaign.routes.js
│   │   │   ├── audit.routes.js
│   │   │   └── user.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── openai.service.js
│   │   │   ├── gemini.service.js
│   │   │   └── grok.service.js
│   │   │
│   │   └── app.js
│   │
│   └── package.json
│
└── README.md
Environment Setup
Server Environment Variables

Create a .env file inside the server folder.

PORT=5000

MONGO_URL=your_mongodb_connection

CLIENT_URL=http://localhost:5173

CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d

XAI_API_KEY=your_xai_api_key
XAI_MODEL=grok-4.3

OPENAI_API_KEY=your_openai_key

GEMINI_API_KEY=your_gemini_key

GOOGLE_CLIENT_ID=your_google_client_id

RESEND_API_KEY=your_resend_key

SENDGRID_API_KEY=your_sendgrid_key
Client Environment Variables

Create a .env file inside the client folder.

VITE_API_URL=http://localhost:5000

VITE_GOOGLE_CLIENT_ID=your_google_client_id
Installation & Running Locally
Clone Repository
git clone https://github.com/your-username/optivio-ai.git
cd optivio-ai
Install Backend Dependencies
cd server
npm install
Run Backend
npm run dev
Install Frontend Dependencies
cd ../client
npm install
Run Frontend
npm run dev
Open Application
http://localhost:5173
API Overview
Authentication Routes
POST /users/register
POST /users/login
POST /users/logout
POST /users/refresh-token
GET  /users/current-user
PATCH /users/change-password
POST /users/forgot-password
POST /users/reset-password
POST /users/oauth/google
Website & SEO Routes
GET    /websites
POST   /websites
PATCH  /websites/:websiteId
DELETE /websites/:websiteId

GET    /websites/:websiteId/audits
POST   /websites/:websiteId/audits

GET    /keywords
POST   /keywords
GET    /keywords/suggestions
Marketing Studio Routes
POST   /campaigns/create
POST   /campaigns/generate
POST   /campaigns/regenerate

GET    /campaigns
GET    /campaigns/:campaignId

DELETE /campaigns/:campaignId

GET    /campaigns/:campaignId/export/pdf
Marketing Workflow
User opens Marketing Studio.
User enters business details.
User selects platform and campaign goal.
AI generates optimized ad copies.
User can regenerate better variations.
Campaigns are stored in MongoDB.
Campaigns can be exported as PDFs.
Security Features
JWT Authentication
HTTP-only Cookies
Secure CORS Configuration
Password Hashing with bcrypt
Request Rate Limiting
Protected API Routes
Role-based Authorization
Deployment Checklist
Backend Deployment
Configure MongoDB Atlas
Set production environment variables
Configure HTTPS
Set secure cookie settings
Deploy Express server

Suggested platforms:

Render
Railway
Fly.io
VPS Hosting
Frontend Deployment

Suggested platforms:

Vercel
Netlify
Render Static Site
Production Notes
SEO audits perform real-time website analysis
AI providers may have token/rate limits
Billing currently supports development-mode checkout
Large website audits should eventually move to background queues
Rate limiting is currently memory-based and can later move to Redis
Future Scope

Planned future improvements:

AI image/banner generation
Social media scheduling
A/B testing suggestions
Email marketing generation
Audience targeting recommendations
Automated marketing funnels
AI-powered analytics dashboard
Campaign performance tracking
Multi-platform auto publishing
Verification Commands
Backend
cd server
npm test
Frontend
cd client
npm run lint
npm run build
Suggested Hosting Architecture
Layer	Platform
Frontend	Vercel
Backend	Render / Railway
Database	MongoDB Atlas
AI APIs	OpenAI + Gemini + xAI
Author

Developed by Shivam Choudhary

License

This project is licensed for educational and portfolio purposes.
