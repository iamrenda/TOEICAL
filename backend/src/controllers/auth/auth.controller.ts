import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import DB from "../../db/db.ts";
import ApiError from "../../util/ApiError.ts";
import logger from "../../logger.ts";
import type { NextFunction, Response } from "express";
import type { ValidatedRequest } from "express-zod-safe";
import type { UserLoginSchema, UserSignupSchema, UserTokenSchema } from "../../schemas/users.schema.ts";
import type { UserTokenPayload, UserEntity } from "../../types/User.ts";
import type { ApiSuccessResponse } from "../../types/ApiResponse.ts";
import { sendSuccess } from "../../util/apiResponse.ts";
import { ErrorCode } from "../../types/ErrorCode.ts";

dotenv.config();

const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "30d";

interface RefreshTokenEntity {
    id: number;
    user_id: number;
    token: string;
    expires_at: string;
    is_revoked: boolean;
}

const generateAccessToken = (user: UserTokenPayload) => {
    try {
        return jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });
    } catch (e) {
        throw new ApiError(401, "Failed to generate access token", {
            cause: e,
            errorCode: ErrorCode.TOKEN_GENERATION_FAILED,
        });
    }
};

const generateRefreshToken = (user: UserEntity) => {
    try {
        return jwt.sign(
            { id: user.id, username: user.username, email: user.email, jti: crypto.randomUUID() },
            process.env.REFRESH_TOKEN_SECRET!,
            {
                expiresIn: REFRESH_TOKEN_EXPIRY,
            },
        );
    } catch (e) {
        throw new ApiError(401, "Failed to generate refresh token", {
            cause: e,
            errorCode: ErrorCode.TOKEN_GENERATION_FAILED,
        });
    }
};

const verifyToken = (refreshToken: string): UserTokenPayload => {
    try {
        return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as UserTokenPayload;
    } catch (e) {
        throw new ApiError(401, "Invalid refresh token", { cause: e, errorCode: ErrorCode.TOKEN_INVALID });
    }
};

export const userSignup = async (
    req: ValidatedRequest<{ body: typeof UserSignupSchema }>,
    res: Response<ApiSuccessResponse<null>>,
    next: NextFunction,
) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10); // 10 is the amount of salt
        const user = { username: req.body.username, email: req.body.email, password: hashPassword };

        await DB().query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3);", [
            user.username,
            user.email,
            user.password,
        ]);

        logger.info(`User ${user.username} signed up successfully`);

        return sendSuccess(res, 201, "User created successfully", null);
    } catch (e) {
        next(e);
    }
};

export const userLogin = async (
    req: ValidatedRequest<{ body: typeof UserLoginSchema }>,
    res: Response<
        ApiSuccessResponse<{
            username: string;
            accessToken: string;
            refreshToken: string;
        }>
    >,
    next: NextFunction,
) => {
    try {
        const [user] = await DB().query<UserEntity>("SELECT * FROM users WHERE email = $1;", [req.body.email]);

        if (!user) {
            throw new ApiError(400, "Invalid email or password", { errorCode: ErrorCode.USER_NOT_FOUND });
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordCorrect || !user) {
            throw new ApiError(400, "Invalid email or password", { errorCode: ErrorCode.VALIDATION_FAILED });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await DB().query("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3);", [
            user.id,
            refreshToken,
            expiresAt.toISOString(),
        ]);

        logger.info(`User ${user.username} logged in successfully`);

        const data = { username: user.username, accessToken, refreshToken };

        return sendSuccess(res, 200, "Login successful", data);
    } catch (e) {
        next(e);
    }
};

export const fetchAccessToken = async (
    req: ValidatedRequest<{ body: typeof UserTokenSchema }>,
    res: Response<ApiSuccessResponse<{ accessToken: string }>>,
    next: NextFunction,
) => {
    try {
        const refreshToken = req.body.token;

        const data = await DB().query<RefreshTokenEntity>(
            "SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW() AND is_revoked = FALSE;",
            [refreshToken],
        );

        if (!data || data.length === 0) {
            throw new ApiError(401, "Invalid refresh token", { errorCode: ErrorCode.TOKEN_INVALID });
        }

        const user = verifyToken(refreshToken);
        const accessToken = generateAccessToken(user);

        return sendSuccess(res, 200, "Access token generated successfully", { accessToken });
    } catch (e) {
        next(e);
    }
};

export const userLogout = async (
    req: ValidatedRequest<{ body: typeof UserTokenSchema }>,
    res: Response<ApiSuccessResponse<null>>,
    next: NextFunction,
) => {
    try {
        const refreshToken = req.body.token;

        const data = await DB().query<RefreshTokenEntity>("SELECT * FROM refresh_tokens WHERE token = $1", [
            refreshToken,
        ]);

        if (!data || data.length === 0) {
            throw new ApiError(401, "Invalid refresh token", { errorCode: ErrorCode.TOKEN_INVALID });
        }

        await DB().query("UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = $1;", [refreshToken]);

        logger.info({ userId: data[0]!.user_id }, "User logged out successfully");

        return sendSuccess(res, 200, "Logout successful", null);
    } catch (e) {
        next(e);
    }
};
