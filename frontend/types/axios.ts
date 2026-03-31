export interface AxiosResponse {
    status: "success" | "error";
    code: number;
    message: string;
    data?: any;
}
