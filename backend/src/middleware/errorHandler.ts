import { type Request, type Response } from "express";
import logger from "../logger.ts";
import ApiError from "../util/ApiError.ts";

export const errorHandler = (err: any, req: Request, res: Response) => {
    // expected / handled
    if (err instanceof ApiError) {
        const log = err.statusCode >= 500 ? logger.error : logger.warn;

        log({ path: req.path, err }, err.message);

        return res.status(err.statusCode).json({
            status: "error",
            code: err.statusCode,
            message: err.message,
        });
    }

    logger.error(`Unexpected error at error handler\n${err}`);
    return res.status(500).json({
        status: "error",
        code: 500,
        message: "An unexpected error occurred",
    });
};
