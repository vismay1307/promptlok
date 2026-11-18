
import { Router, type Router as ExpressRouter } from "express";

import { RequestController } from "../controllers/request.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireLocalUser } from "../middleware/local-user.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createRequestSchema,
  requestIdParamSchema,
  requestListQuerySchema,
} from "../validators/request.validators.js";

const requestRouter: ExpressRouter = Router();

// Create request
requestRouter.post(
  "/",
  requireAuth,
  requireLocalUser,
  validate({
    body: createRequestSchema,
  }),
  RequestController.create,
);

// Own requests — must be before /:id
requestRouter.get(
  "/mine",
  requireAuth,
  requireLocalUser,
  validate({
    query: requestListQuerySchema,
  }),
  RequestController.getMine,
);

// Browse requests
requestRouter.get(
  "/",
  requireAuth,
  requireLocalUser,
  validate({
    query: requestListQuerySchema,
  }),
  RequestController.list,
);

// Request detail
requestRouter.get(
  "/:id",
  requireAuth,
  requireLocalUser,
  validate({
    params: requestIdParamSchema,
  }),
  RequestController.getById,
);

export default requestRouter;
