import { ErrorType } from "@/types/Error";

export const ErrorMessages: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: "ネットワークエラーが発生しました。インターネット接続を確認してください。",
    [ErrorType.AUTH]: "認証エラーが発生しました。再度ログインしてください。",
    [ErrorType.SERVER]: "サーバーエラーが発生しました。後でもう一度お試しください。",
    [ErrorType.VALIDATION]: "入力エラーが発生しました。入力内容を確認してください。",
};
