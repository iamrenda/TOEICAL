import { ApiErrorType, LoginErrorType, SignUpErrorType } from "@/types/error";

export const loginErrorMessages: Record<LoginErrorType, string> = {
    INVALID_CREDENTIALS: "メールアドレスまたはパスワードが間違っています",
    TOO_MANY_ATTEMPTS: "ログイン試行回数が多すぎます。後でもう一度お試しください",
    NETWORK_ERROR: "ネットワークエラー。インターネット接続を確認してください",
    SERVER_ERROR: "サーバーエラーが発生しました。後でもう一度お試しください",
};

export const signUpErrorMessages: Record<SignUpErrorType, string> = {
    USER_ALREADY_EXISTS: "ユーザーは既に存在しています",
    NETWORK_ERROR: "ネットワークエラー。インターネット接続を確認してください",
    SERVER_ERROR: "サーバーエラーが発生しました。後でもう一度お試しください",
};

export const apiErrorMessages: Record<ApiErrorType, string> = {
    UNKNOWN_ERROR: "不明なエラーが発生しました。後でもう一度お試しください",
    NETWORK_ERROR: "ネットワークエラー。インターネット接続を確認してください",
    SERVER_ERROR: "サーバーエラーが発生しました。後でもう一度お試しください",
};
