import type { ValidateRequestGlobalOptions } from "express-zod-safe";
import logger from "../logger.ts";
type ValidationHandler = NonNullable<ValidateRequestGlobalOptions["handler"]>;

const zodValidationErrorHandler: ValidationHandler = (errors, req, res, next) => {
    logger.warn(
        {
            path: req.path,
            errors,
        },
        "Validation failed",
    );

    res.status(400).json({
        status: "error",
        code: 400,
        message: "Input validation failed",
    });
};

export default zodValidationErrorHandler;
