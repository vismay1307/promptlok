import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated || !userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  req.auth = {
    clerkUserId: userId,
  };

  next();
};