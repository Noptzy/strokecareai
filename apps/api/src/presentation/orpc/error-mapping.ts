import type { AppError, AppErrorCode } from "@api/application/shared/errors"
import { ORPCError } from "@orpc/server"

export const errorCodeToHttpStatus: Record<AppErrorCode, number> = {
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	BAD_REQUEST: 400,
	CONFLICT: 409,
	INTERNAL_ERROR: 500,
}

const APP_ERROR_TO_ORPC_STRING: Record<AppErrorCode, string> = {
	UNAUTHORIZED: "UNAUTHORIZED",
	FORBIDDEN: "FORBIDDEN",
	NOT_FOUND: "NOT_FOUND",
	BAD_REQUEST: "BAD_REQUEST",
	CONFLICT: "CONFLICT",
	INTERNAL_ERROR: "INTERNAL_SERVER_ERROR",
}

export function mapAppErrorToORPCError(error: unknown): Error {
	if (error && typeof error === "object" && "name" in error && error.name === "AppError") {
		const appError = error as AppError
		return new ORPCError(APP_ERROR_TO_ORPC_STRING[appError.code] as any, {
			message: appError.message,
		})
	}
	if (error instanceof Error) return error
	if (error && typeof error === "object" && "message" in error) return new Error(String(error.message))
	return new Error(String(error))
}
