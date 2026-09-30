import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  findOrCreateLocalUser,
} from "../services/user.service.js";

import type {
  UserRole,
} from "../types/authorization.js";

export const requireRole = (
  ...allowedRoles: UserRole[]
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const clerkUserId = req.auth?.clerkUserId;

      if (!clerkUserId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const user =
        await findOrCreateLocalUser(clerkUserId);

      if (!allowedRoles.includes(user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};