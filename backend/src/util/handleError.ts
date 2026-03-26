import type { Response } from "express";

interface PostgresError extends Error {
    code: string;
    detail?: string;
    table?: string;
    constraint?: string;
}

// https://www.postgresql.org/docs/current/errcodes-appendix.html
const errorMapping: Record<string, { status: number; message: string }> = {
    "23503": { status: 400, message: "Related record not found." },
    "22P02": { status: 400, message: "Invalid input format." },
    "23505": { status: 409, message: "This record already exists." },
    "42P01": { status: 500, message: "Database configuration error (Table missing)." },
    "57P01": { status: 503, message: "Database is shutting down." },
    "08006": { status: 503, message: "Database connection failed." },
};

const handleError = (e: Error | unknown, res: Response) => {
    if (e instanceof Error) {
        console.log("Database error: " + e);

        const pgErr = e as PostgresError;
        console.log(pgErr.code);

        const errorInfo = errorMapping[pgErr.code];

        if (errorInfo) {
            return res.status(errorInfo.status).json({
                reason: errorInfo.message,
            });
        }

        return res.status(500).json({
            reason: "An unexpected database error occurred.",
        });
    } else {
        console.error("An unknown error occurred:", e);
    }
};

export default handleError;
