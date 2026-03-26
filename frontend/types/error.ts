export enum LoginErrorType {
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS", // Wrong email or password - corresponds to 401
    TOO_MANY_ATTEMPTS = "TOO_MANY_ATTEMPTS",
    NETWORK_ERROR = "NETWORK_ERROR",
    SERVER_ERROR = "SERVER_ERROR",
}

export const loginErrorMessages: Record<LoginErrorType, string> = {
    INVALID_CREDENTIALS: "メールアドレスまたはパスワードが間違っています",
    TOO_MANY_ATTEMPTS: "ログイン試行回数が多すぎます。後でもう一度お試しください",
    NETWORK_ERROR: "ネットワークエラー。インターネット接続を確認してください",
    SERVER_ERROR: "サーバーエラーが発生しました。後でもう一度お試しください",
};

export enum SignUpErrorType {
    USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
    NETWORK_ERROR = "NETWORK_ERROR",
    SERVER_ERROR = "SERVER_ERROR",
}

export const signUpErrorMessages: Record<SignUpErrorType, string> = {
    USER_ALREADY_EXISTS: "ユーザーは既に存在しています",
    NETWORK_ERROR: "ネットワークエラー。インターネット接続を確認してください",
    SERVER_ERROR: "サーバーエラーが発生しました。後でもう一度お試しください",
};
