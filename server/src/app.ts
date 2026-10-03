import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";

import { env } from "./config/env.js";
import tagRoutes from "./routes/tag.routes.js";
import authRouter from "./routes/auth.routes.js";
import authTestRouter from "./routes/auth-test.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import categoryRoutes from "./routes/category.routes.js";




const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
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
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/auth", authRouter);

app.use("/api/auth-test", authTestRouter);

app.use(errorHandler);



export default app;