import { Router } from "express";

import { PromptController } from "../controllers/prompt.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { requireLocalUser } from "../middleware/local-user.middleware.js";
import {
  createPromptSchema,
  getMineQuerySchema,
  promptIdParamSchema,
  updatePromptSchema,
  createPromptVersionSchema,
  promptVersionParamSchema
} from "../validators/prompt.validators.js";

const promptRouter = Router();

promptRouter.post(
  "/",
  requireAuth,
  requireLocalUser,
  validate({
    body: createPromptSchema,
  }),
  PromptController.create,
);

promptRouter.get(
  "/mine",
  requireAuth,requireLocalUser,
  validate({
    query: getMineQuerySchema,
  }),
  PromptController.getMine,
);

promptRouter.patch(
  "/:id",
  requireAuth,requireLocalUser,
  validate({
    params: promptIdParamSchema,
    body: updatePromptSchema,
  }),
  PromptController.update,
);

promptRouter.delete(
  "/:id",
  requireAuth,requireLocalUser,
  validate({
    params: promptIdParamSchema,
  }),
  PromptController.softDelete,
);
// Get all versions of a prompt
promptRouter.get(
  "/:id/versions",
  requireAuth,
  requireLocalUser,
  validate({
    params: promptIdParamSchema,
  }),
  PromptController.getVersions,
);

// Get a specific prompt version
promptRouter.get(
  "/:id/versions/:versionId",
  requireAuth,
  requireLocalUser,
  validate({
    params: promptVersionParamSchema,
  }),
  PromptController.getVersionById,
);

// Create a new prompt version
promptRouter.post(
  "/:id/versions",
  requireAuth,
  requireLocalUser,
  validate({
    params: promptIdParamSchema,
    body: createPromptVersionSchema,
  }),
  PromptController.createVersion,
);

// Restore a previous version by creating a new version
promptRouter.post(
  "/:id/versions/:versionId/restore",
  requireAuth,
  requireLocalUser,
  validate({
    params: promptVersionParamSchema,
  }),
  PromptController.restoreVersion,
);
promptRouter.get(
  "/:id",
  requireAuth,requireLocalUser,
  validate({
    params: promptIdParamSchema,
  }),
  PromptController.getById,
);

export default promptRouter;