import type {
  Request,
  Response,
} from "express";

import {
  findOrCreateLocalUser,
} from "../services/user.service.js";

import { ApiResponse } from "../utils/ApiResponse.js";

export const getCurrentUser = async (
  req: Request,
  res: Response
) => {
  const clerkUserId =
    req.auth?.clerkUserId;

  if (!clerkUserId) {
    throw new Error("Authenticated identity missing");
  }

  const user =
    await findOrCreateLocalUser(
      clerkUserId
    );

  return res.status(200).json(
    new ApiResponse({
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatar: user.avatar,
      accountStatus: user.accountStatus,
      role: user.role,
    })
  );
};