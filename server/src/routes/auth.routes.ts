import { Router } from "express";
import { getCurrentUser } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
const router = Router();
router.use(requireAuth);
router.get("/me", getCurrentUser);
export default router;
