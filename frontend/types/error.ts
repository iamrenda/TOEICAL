export enum ErrorType {
    NETWORK = "NETWORK",
    AUTH = "AUTH",
    SERVER = "SERVER",
    VALIDATION = "VALIDATION",
}

export const ErrorCodeMapping: Record<number, ErrorType> = {
    0: ErrorType.NETWORK,
    400: ErrorType.VALIDATION, // Bad Request (Wrong password, missing fields, etc.)
    401: ErrorType.AUTH, // Unauthorized (Invalid or expired access token)
    403: ErrorType.AUTH, // Forbidden (Expired refresh token)
    404: ErrorType.SERVER,
    409: ErrorType.VALIDATION, // Conflict (e.g., email already exists during sign-up)
    422: ErrorType.VALIDATION, // Unprocessable Entity (Validation errors)
    500: ErrorType.SERVER,
};

export const ErrorMessageMapping: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: "ネットワークエラーが発生しました。インターネット接続を確認してください。",
    [ErrorType.AUTH]: "認証エラーが発生しました。再度ログインしてください。",
    [ErrorType.SERVER]: "サーバーエラーが発生しました。後でもう一度お試しください。",
    [ErrorType.VALIDATION]: "入力エラーが発生しました。入力内容を確認してください。",
};
