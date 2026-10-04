import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";
import apiRouter from "./routes/index.routes.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(clerkMiddleware());

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

app.use("/api", apiRouter);

app.use(errorHandler);

export default app;