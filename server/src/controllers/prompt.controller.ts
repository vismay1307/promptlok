import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { promptService } from "../services/prompt.service.js";

export class PromptController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = req.user;

      if (!user) {
        return next(
          new Error("Authenticated user not found"),
        );
      }

      const prompt = await promptService.create(
        user.id,
        req.body,
      );

      return res.status(201).json({
        success: true,
        data: prompt,
      });
    } catch (error) {
      next(error);
    }
  }
}