import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { rateLimiter, securityHeaders } from './middleware/security.middleware.js';

const app = express();
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.use(securityHeaders);
app.use(rateLimiter({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  max: Number(process.env.RATE_LIMIT_MAX || 180),
}));
app.use(
  cors({
    origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" })); // access to json data
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // access to URl data

app.use(cookieParser());

//Routes
import userRoute from "./routes/user.routes.js";
import websiteRoute from "./routes/website.routes.js";
import keywordRoute from "./routes/keyword.routes.js";
import notificationRoute from "./routes/notification.routes.js";
import teamRoute from "./routes/team.routes.js";
import billingRoute from "./routes/billing.routes.js";
import adminRoute from "./routes/admin.routes.js";
import errorMiddleware from './middleware/erro.middleware.js';

app.use("/api/v1/users" , userRoute);
app.use("/api/v1/websites" , websiteRoute);
app.use("/api/v1/keywords" , keywordRoute);
app.use("/api/v1/notifications" , notificationRoute);
app.use("/api/v1/teams" , teamRoute);
app.use("/api/v1/billing" , billingRoute);
app.use("/api/v1/admin" , adminRoute);

app.use(errorMiddleware);

export default app;
