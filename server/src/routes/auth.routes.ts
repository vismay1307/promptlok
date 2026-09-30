import { Router } from "express";

import {
  getCurrentUser,
} from "../controllers/auth.controller.js";

import {
  requireAuth,
} from "../middleware/auth.middleware.js";

import {
  asyncHandler,
} from "../utils/AsyncHandler.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/me",
  asyncHandler(getCurrentUser)
);

export default router;