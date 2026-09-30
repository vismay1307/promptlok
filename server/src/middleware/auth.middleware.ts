import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { getAuth } from "@clerk/express";

import { ApiError } from "../utils/ApiError.js";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { isAuthenticated, userId } =
    getAuth(req);

  if (!isAuthenticated || !userId) {
    return next(
      new ApiError(
        401,
        "UNAUTHORIZED",
        "Unauthorized"
      )
    );
  }

  req.auth = {
    clerkUserId: userId,
  };

  next();
};