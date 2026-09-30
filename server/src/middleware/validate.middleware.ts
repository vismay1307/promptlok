import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { ZodError, type ZodSchema } from "zod";

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
    res: Response,
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
        return res.status(400).json({
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "Validation failed",
            details: error.flatten().fieldErrors,
          },
        });
      }

      next(error);
    }
  };
};