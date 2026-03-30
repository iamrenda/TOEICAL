import { ErrorType } from "./error";

export interface ApiResponse {
    status: "success" | "error";
    code: number;
    data?: any;
    error?: string;
    details?: Record<string, any>;
}

export interface ApiError {
    type: ErrorType;
    code: number;
    message: string;
    details?: Record<string, any>;
    originalError?: any;
}
