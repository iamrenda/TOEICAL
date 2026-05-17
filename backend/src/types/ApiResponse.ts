export interface ApiResponse<T> {
    status: "success" | "error";
    code: number;
    message?: string;
    data?: T;
}
