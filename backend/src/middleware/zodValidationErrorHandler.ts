import type { ValidateRequestGlobalOptions } from "express-zod-safe";
import logger from "../logger.ts";
import { sendError } from "../util/apiResponse.ts";
import { ErrorCode } from "../types/ErrorCode.ts";

type ValidationHandler = NonNullable<ValidateRequestGlobalOptions["handler"]>;

const zodValidationErrorHandler: ValidationHandler = (errors, req, res, next) => {
    logger.warn(
        {
            path: req.path,
            errors,
        },
        "Request validation failed",
    );

    // It will not go through errorHandler
    sendError(res, 400, "Request validation failed", ErrorCode.INVALID_FORMAT);
};

export default zodValidationErrorHandler;
