import { type NextFunction, type Request, type Response } from "express";
import type ApiError from "../util/ApiError.ts";

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "An unexpected error occurred.";

    const response = {
        status: "error",
        code: err.statusCode,
        message: err.message,
    };

    return res.status(err.statusCode).json(response);
};

export default errorHandler;
