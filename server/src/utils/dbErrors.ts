import { ApiError } from "./ApiError.js";

export function mapDatabaseError(error: unknown): never {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const databaseError = error as {
      code?: string;
      detail?: string;
      constraint?: string;
    };

    if (databaseError.code === "23503") {
      throw new ApiError(
        400,
        "FOREIGN_KEY_VIOLATION",
        "Referenced resource does not exist",
      );
    }

    if (databaseError.code === "23505") {
      throw new ApiError(
        409,
        "UNIQUE_VIOLATION",
        "Resource already exists",
      );
    }
  }

  throw error;
}