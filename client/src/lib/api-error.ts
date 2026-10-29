import { isAxiosError } from "axios";

export type FieldErrors = Record<string, string[]>;

type ApiErrorOptions = {
  status: number | null;
  code: string;
  message: string;
  details?: unknown;
  fieldErrors?: FieldErrors;
};

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function extractFieldErrors(details: unknown): FieldErrors | undefined {
  const record = asRecord(details);
  if (!record) return undefined;

  // Handles both { title: ["..."] } and Zod's
  // { fieldErrors: { title: ["..."] }, formErrors: [] }.
  const candidate = asRecord(record.fieldErrors) ?? record;
  const result: FieldErrors = {};

  for (const [key, value] of Object.entries(candidate)) {
    if (key === "formErrors") continue;

    if (
      Array.isArray(value) &&
      value.every((item): item is string => typeof item === "string")
    ) {
      result[key] = value;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

export class ApiError extends Error {
  readonly status: number | null;
  readonly code: string;
  readonly details?: unknown;
  readonly fieldErrors?: FieldErrors;

  constructor(options: ApiErrorOptions) {
    super(options.message);

    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;

    if (options.details !== undefined) {
      this.details = options.details;
    }

    if (options.fieldErrors !== undefined) {
      this.fieldErrors = options.fieldErrors;
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (isAxiosError(error)) {
    const responseBody = asRecord(error.response?.data);
    const serverError = asRecord(responseBody?.error);

    const status = error.response?.status ?? null;
    const details = serverError?.details ?? responseBody?.details;

    const message =
      typeof serverError?.message === "string"
        ? serverError.message
        : status === null
          ? "Unable to reach the API server. Check your connection and server status."
          : `The request failed with status ${status}.`;

    const code =
      typeof serverError?.code === "string"
        ? serverError.code
        : status === null
          ? "NETWORK_ERROR"
          : "HTTP_ERROR";

    return new ApiError({
      status,
      code,
      message,
      details,
      fieldErrors: extractFieldErrors(details),
    });
  }

  return new ApiError({
    status: null,
    code: "UNEXPECTED_ERROR",
    message: "An unexpected error occurred. Please try again.",
  });
}