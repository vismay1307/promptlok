import { Router } from "express";

import categoryRoutes from "./category.routes.js";
import tagRoutes from "./tag.routes.js";
import authRouter from "./auth.routes.js";
import authTestRouter from "./auth-test.routes.js";
import promptRouter from "./prompt.routes.js";

const apiRouter = Router();

apiRouter.use("/categories", categoryRoutes);
apiRouter.use("/tags", tagRoutes);
apiRouter.use("/auth", authRouter);
apiRouter.use("/auth-test", authTestRouter);
apiRouter.use("/prompts", promptRouter);

export default apiRouter;