import { ORPCError } from "@orpc/server";
import { AppError, type AppErrorCode } from "../../application/shared/errors.ts";

export const errorCodeToHttpStatus: Record<AppErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

export function mapAppErrorToORPCError(error: unknown): Error {
  if (error instanceof AppError) {
    return new ORPCError({
      code: error.code,
      message: error.message,
    });
  }
  return error instanceof Error ? error : new Error(String(error));
}
