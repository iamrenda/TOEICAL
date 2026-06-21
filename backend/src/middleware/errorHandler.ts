import { type NextFunction, type Request, type Response } from "express";
import type ApiError from "../util/ApiError.ts";
import logger from "../logger.ts";

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "An unexpected error occurred.";

    const response = {
        status: "error",
        code: err.statusCode,
        message: err.message,
    };

    const log = err.statusCode >= 500 ? logger.error : logger.warn;
    log({ err, path: req.path }, err.message);

    return res.status(err.statusCode).json(response);
};

export default errorHandler;
