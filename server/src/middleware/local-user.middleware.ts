
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  findOrCreateLocalUser,
} from "../services/user.service.js";

import { ApiError } from "../utils/ApiError.js";

export const requireLocalUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const clerkUserId = req.auth?.clerkUserId;

    if (!clerkUserId) {
      return next(
        new ApiError(
          401,
          "UNAUTHORIZED",
          "Unauthorized",
        ),
      );
    }

    const user = await findOrCreateLocalUser(clerkUserId);

    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};
