import { type ErrorRequestHandler } from "express";
import logger from "../logger.ts";
import ApiError from "../util/ApiError.ts";
import { sendError } from "../util/apiResponse.ts";
import { ErrorCode } from "../types/ErrorCode.ts";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    // expected / handled
    if (err instanceof ApiError) {
        const logType = err.statusCode >= 500 ? "error" : "warn";

        logger[logType]({ err, path: req.path, method: req.method }, err.message);

        return sendError(res, err.statusCode, err.message, err.errorCode);
    }

    logger.error({ err, path: req.path, method: req.method }, "Unhandled error");
    return sendError(res, 500, "An unexpected error occurred", ErrorCode.INTERNAL_SERVER_ERROR);
};
