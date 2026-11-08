import { type ErrorRequestHandler } from "express";
import logger from "../logger.ts";
import ApiError from "../util/ApiError.ts";
import { sendError } from "../util/sendResponse.ts";
import { ErrorCode } from "@toeical/shared";
import { DatabaseError } from "pg";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    // expected / handled
    if (err instanceof ApiError) {
        const logType = err.statusCode >= 500 ? "error" : "warn";

        logger[logType]({ err, path: req.path, query: req.query, method: req.method }, err.message);

        // Email / username already exists
        if (err.cause instanceof DatabaseError && err.cause.code === "23505") {
            return sendError(
                res,
                400,
                err.cause.constraint === "users_username_key"
                    ? "Username already exists"
                    : "Email already exists",
                err.cause.constraint === "users_username_key"
                    ? ErrorCode.USERNAME_ALREADY_EXISTS
                    : ErrorCode.EMAIL_ALREADY_EXISTS,
            );
        }

        return sendError(res, err.statusCode, err.message, err.errorCode);
    }

    logger.error({ err, path: req.path, method: req.method }, "Unhandled error");
    return sendError(res, 500, "An unexpected error occurred", ErrorCode.INTERNAL_SERVER_ERROR);
};
