export interface UserStorageData {
    username: string;
}

export interface UserTokenData {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;
    refreshTokenExpiresAt: number;
}
