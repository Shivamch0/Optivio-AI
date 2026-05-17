import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

const app = express();
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.set("trust proxy", 1);
app.use(
  cors({
    origin: corsOrigin,
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
import errorMiddleware from './middleware/erro.middleware.js';

app.use("/api/v1/users" , userRoute);
app.use("/api/v1/websites" , websiteRoute);
app.use("/api/v1/keywords" , keywordRoute);
app.use("/api/v1/notifications" , notificationRoute);

app.use(errorMiddleware);

export default app;
