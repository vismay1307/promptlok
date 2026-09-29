import type { Request, Response, NextFunction } from "express";
import { findOrCreateLocalUser } from "../services/user.service.js";
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const clerkUserId = req.auth?.clerkUserId;
    if (!clerkUserId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await findOrCreateLocalUser(clerkUserId);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
