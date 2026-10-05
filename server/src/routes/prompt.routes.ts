import { Router } from "express";

import { PromptController } from "../controllers/prompt.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createPromptSchema,
  getMineQuerySchema,
  promptIdParamSchema,
  updatePromptSchema,
} from "../validators/prompt.validators.js";

const promptRouter = Router();

/**
 * POST /api/prompts
 * Create a new prompt
 */
promptRouter.post(
  "/",
  requireAuth,
  validate({
    body: createPromptSchema,
  }),
  PromptController.create,
);

/**
 * GET /api/prompts/mine
 * Get current user's prompts
 *
 * IMPORTANT:
 * This route must come before /:id.
 */
promptRouter.get(
  "/mine",
  requireAuth,
  validate({
    query: getMineQuerySchema,
  }),
  PromptController.getMine,
);

/**
 * PATCH /api/prompts/:id
 * Update prompt metadata
 */
promptRouter.patch(
  "/:id",
  requireAuth,
  validate({
    params: promptIdParamSchema,
    body: updatePromptSchema,
  }),
  PromptController.update,
);

/**
 * GET /api/prompts/:id
 * Get a single prompt by ID
 */
promptRouter.get(
  "/:id",
  requireAuth,
  validate({
    params: promptIdParamSchema,
  }),
  PromptController.getById,
);

export default promptRouter;