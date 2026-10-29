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
        res.locals.validated.body
      );

      return res.status(201).json({
        success: true,
        data: prompt,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(
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

      const prompt = await promptService.getById(
        {
          id: user.id,
          accountStatus: user.accountStatus,
        },
        res.locals.validated.params.id
      );

      return res.status(200).json({
        success: true,
        data: prompt,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMine(
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

      const prompts = await promptService.getMine(
        user.id,
        res.locals.validated.query,
      );

      return res.status(200).json({
        success: true,
        data: prompts,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(
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

      const prompt = await promptService.update(
        {
          id: user.id,
          accountStatus: user.accountStatus,
        },
          res.locals.validated.params.id,
          res.locals.validated.body,
      );

      return res.status(200).json({
        success: true,
        data: prompt,
      });
    } catch (error) {
      next(error);
    }
  }

  static async softDelete(
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

      await promptService.softDelete(
        {
          id: user.id,
          accountStatus: user.accountStatus,
        },
        res.locals.validated.params.id
      );

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}