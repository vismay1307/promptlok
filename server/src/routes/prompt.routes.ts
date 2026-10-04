import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { createPromptSchema } from "../validators/prompt.validators.js";
import { PromptController } from "../controllers/prompt.controller.js";

export const promptRouter = Router();

promptRouter.post(
  "/",
  requireAuth,
  validate({
    body: createPromptSchema,
  }),
  PromptController.create,
);