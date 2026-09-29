import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/test", requireAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authenticated successfully",
    clerkUserId: req.auth?.clerkUserId,
  });
});

export default router;