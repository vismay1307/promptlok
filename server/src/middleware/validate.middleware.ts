import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  ZodError,
  type ZodSchema,
} from "zod";

import { ApiError } from "../utils/ApiError.js";

type ValidationSchemas = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export const validate = (
  schemas: ValidationSchemas
) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        schemas.params.parse(req.params);
      }

      if (schemas.query) {
        schemas.query.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ApiError(
            400,
            "BAD_REQUEST",
            "Validation failed",
            error.flatten().fieldErrors
          )
        );
      }

      next(error);
    }
  };
};