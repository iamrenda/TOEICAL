import { ErrorType } from "@/types/Error";

export const ErrorMessages: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: "ネットワークエラーが発生しました。インターネット接続を確認してください。",
    [ErrorType.AUTH]: "認証エラーが発生しました。再度ログインしてください。",
    [ErrorType.SERVER]: "サーバーエラーが発生しました。後でもう一度お試しください。",
    [ErrorType.VALIDATION]: "入力エラーが発生しました。入力内容を確認してください。",

    [ErrorType.FORBIDDEN]: "アクセスが拒否されました。必要な権限があるか確認してください。",
    [ErrorType.NOT_FOUND]: "リクエストされたリソースが見つかりませんでした。",
    [ErrorType.UNKNOWN]: "不明なエラーが発生しました。後でもう一度お試しください。",
};
