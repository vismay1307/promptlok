import { Router } from "express";
import { getAuth } from "@clerk/express";

import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { testQuerySchema } from "../db/schema/auth.schema.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

router.get("/test", (req, res) => {
  const { isAuthenticated, userId } =
    getAuth(req);

  if (!isAuthenticated) {
    throw new ApiError(
      401,
      "UNAUTHORIZED",
      "Unauthorized"
    );
  }

  return res.status(200).json(
    new ApiResponse({
      message: "Backend authentication successful",
      userId,
    })
  );
});

router.get(
  "/admin-test",
  requireAuth,
  requireRole("admin"),
  (_req, res) => {
    return res.status(200).json(
      new ApiResponse({
        message:
          "Admin authorization successful",
      })
    );
  }
);

router.get(
  "/validation-test",
  requireAuth,
  validate({
    query: testQuerySchema,
  }),
  (req, res) => {
    return res.status(200).json(
      new ApiResponse({
        message: "Validation successful",
        username: req.query.username,
      })
    );
  }
);

router.get(
  "/error-test/not-found",
  (_req, _res) => {
    throw new ApiError(
      404,
      "NOT_FOUND",
      "Test resource not found"
    );
  }
);

router.get(
  "/error-test/database",
  (_req, _res) => {
    throw new ApiError(
      500,
      "DATABASE_ERROR",
      "Database operation failed"
    );
  }
);

router.get(
  "/error-test/unknown",
  (_req, _res) => {
    throw new Error(
      "This is an internal test error"
    );
  }
);

export default router;