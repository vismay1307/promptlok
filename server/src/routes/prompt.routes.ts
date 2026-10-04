import { Router } from "express";

import { PromptController } from "../controllers/prompt.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createPromptSchema } from "../validators/prompt.validators.js";

const promptRouter = Router();

promptRouter.post(
  "/",
  requireAuth,
  validate({
    body: createPromptSchema,
  }),
  PromptController.create,
);

export default promptRouter;