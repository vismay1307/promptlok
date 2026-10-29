
import { Router } from "express";

import categoryRoutes from "./category.routes.js";
import tagRoutes from "./tag.routes.js";
import authRouter from "./auth.routes.js";
import authTestRouter from "./auth-test.routes.js";
import promptRouter from "./prompt.routes.js";
import { env } from "../config/env.js";

const apiRouter = Router();

apiRouter.use("/categories", categoryRoutes);
apiRouter.use("/tags", tagRoutes);
apiRouter.use("/auth", authRouter);
apiRouter.use("/prompts", promptRouter);

if (env.NODE_ENV !== "production") {
  apiRouter.use("/auth-test", authTestRouter);
}

export default apiRouter;
