import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" })); // access to json data
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // access to URl data

app.use(cookieParser());

//Routes
import userRoute from "./routes/user.routes.js";
import errorMiddleware from './middleware/erro.middleware.js';

app.use("/api/v1/users" , userRoute);

app.use(errorMiddleware);

export default app;
