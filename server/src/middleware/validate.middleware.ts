
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

export const validate = (schemas: ValidationSchemas) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.locals.validated = {
        ...(schemas.body
          ? { body: schemas.body.parse(req.body) }
          : {}),
        ...(schemas.params
          ? { params: schemas.params.parse(req.params) }
          : {}),
        ...(schemas.query
          ? { query: schemas.query.parse(req.query) }
          : {}),
      };

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ApiError(
            400,
            "BAD_REQUEST",
            "Validation failed",
            error.flatten().fieldErrors,
          ),
        );
      }

      next(error);
    }
  };
};
