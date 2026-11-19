
import type { RequestHandler } from "express";

import { requestService } from "../services/request.service.js";

import type {
  CreateRequestInput,
  UpdateRequestInput,
  RequestListQuery,
} from "../validators/request.validators.js";

export class RequestController {
  static create: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user!;
      const input = res.locals.validated.body as CreateRequestInput;

      const result = await requestService.create(user, input);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getMine: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user!;
      const query = res.locals.validated.query as RequestListQuery;

      const result = await requestService.getMine(user, query);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static list: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user!;
      const query = res.locals.validated.query as RequestListQuery;

      const result = await requestService.list(user, query);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getById: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user!;
      const { id } = res.locals.validated.params as { id: string };

      const result = await requestService.getById(user, id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

    static update: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user!;
      const { id } = res.locals.validated.params as { id: string };
      const input = res.locals.validated.body as UpdateRequestInput;

      const result = await requestService.update(user, id, input);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static close: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user!;
      const { id } = res.locals.validated.params as { id: string };

      const result = await requestService.close(user, id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static remove: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user!;
      const { id } = res.locals.validated.params as { id: string };

      const result = await requestService.softDelete(user, id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
