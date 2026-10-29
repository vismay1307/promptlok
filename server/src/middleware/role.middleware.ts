
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { getExistingLocalUser } from "../services/user.service.js";
import type { UserRole } from "../types/authorization.js";
import { ApiError } from "../utils/ApiError.js";

export const requireRole = (...allowedRoles: UserRole[]) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    try {
      const clerkUserId = req.auth?.clerkUserId;

      if (!clerkUserId) {
        return next(
          new ApiError(401, "UNAUTHORIZED", "Unauthorized"),
        );
      }

      const user = await getExistingLocalUser(clerkUserId);

      if (!user) {
        return next(
          new ApiError(403, "FORBIDDEN", "Forbidden"),
        );
      }

      if (!allowedRoles.includes(user.role as UserRole)) {
        return next(
          new ApiError(403, "FORBIDDEN", "Forbidden"),
        );
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
