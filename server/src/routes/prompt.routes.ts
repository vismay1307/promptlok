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

promptRouter.post(
  "/",
  requireAuth,
  validate({
    body: createPromptSchema,
  }),
  PromptController.create,
);

promptRouter.get(
  "/mine",
  requireAuth,
  validate({
    query: getMineQuerySchema,
  }),
  PromptController.getMine,
);

promptRouter.patch(
  "/:id",
  requireAuth,
  validate({
    params: promptIdParamSchema,
    body: updatePromptSchema,
  }),
  PromptController.update,
);

promptRouter.delete(
  "/:id",
  requireAuth,
  validate({
    params: promptIdParamSchema,
  }),
  PromptController.softDelete,
);

promptRouter.get(
  "/:id",
  requireAuth,
  validate({
    params: promptIdParamSchema,
  }),
  PromptController.getById,
);

export default promptRouter;