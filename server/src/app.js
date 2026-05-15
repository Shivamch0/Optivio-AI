import expres, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" })); // access to json data
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // access to URl data

app.use(cookieParser());

export default app;