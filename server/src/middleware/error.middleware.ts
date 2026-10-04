import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";
import { mapDatabaseError } from "../utils/dbErrors.js";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: error.flatten(),
      },
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details !== undefined
          ? { details: error.details }
          : {}),
      },
    });
  }

  try {
    mapDatabaseError(error);
  } catch (mappedError) {
    if (mappedError instanceof ApiError) {
      return res.status(mappedError.statusCode).json({
        success: false,
        error: {
          code: mappedError.code,
          message: mappedError.message,
          ...(mappedError.details !== undefined
            ? { details: mappedError.details }
            : {}),
        },
      });
    }

    console.error(mappedError);

    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    },
  });
}