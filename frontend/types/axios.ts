export interface AxiosResponse<T> {
    status: "success" | "error";
    code: number;
    message: string;
    data?: T;
}
