import { Router } from "express";
import { getAuth } from "@clerk/express";

import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { testQuerySchema } from "../db/schema/auth.schema.js";

const router = Router();

router.get("/test", (req, res) => {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Backend authentication successful",
    userId,
  });
});

router.get(
  "/admin-test",
  requireAuth,
  requireRole("admin"),
  (_req, res) => {
    return res.status(200).json({
      success: true,
      message: "Admin authorization successful",
    });
  }
);
router.get(
  "/validation-test",
  requireAuth,
  validate({
    query: testQuerySchema,
  }),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Validation successful",
      username: req.query.username,
    });
  }
);
export default router;