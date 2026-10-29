
import { Router } from "express";
import { createTag, searchTags } from "../controllers/tag.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createTagSchema,
  searchTagsSchema,
} from "../validators/tag.validator.js";

const router = Router();

router.get(
  "/",
  validate({ query: searchTagsSchema.query }),
  searchTags,
);

router.post(
  "/",
  requireAuth,
  validate({ body: createTagSchema.body }),
  createTag,
);

export default router;
