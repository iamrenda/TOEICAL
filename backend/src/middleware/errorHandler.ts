import { type ErrorRequestHandler, type NextFunction, type Request, type Response } from "express";
import logger from "../logger.ts";
import ApiError from "../util/ApiError.ts";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    // expected / handled
    if (err instanceof ApiError) {
        const logType = err.statusCode >= 500 ? "error" : "warn";

        logger[logType]({ err, path: req.path, method: req.method }, err.message);

        return res.status(err.statusCode).json({
            status: "error",
            code: err.statusCode,
            message: err.message,
        });
    }

    logger.error({ err, path: req.path, method: req.method }, "Unhandled error");
    return res.status(500).json({
        status: "error",
        code: 500,
        message: "An unexpected error occurred",
    });
};
