import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import DB from "../../db/api.ts";
import ApiError from "../../util/ApiError.ts";
import type { NextFunction, Response } from "express";
import type { ValidatedRequest } from "express-zod-safe";
import type { UserLoginSchema, UserSignupSchema, UserTokenSchema } from "../../schemas/users.schema.ts";
import type { UserTokenPayload, UserEntity } from "../../types/User.ts";

dotenv.config();

const refreshTokens: string[] = [];

const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "7d";

const generateAccessToken = (user: UserTokenPayload) => {
    try {
        return jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });
    } catch (e) {
        throw new ApiError(500, "Failed to generate access token");
    }
};

const generateRefreshToken = (user: UserEntity) => {
    try {
        return jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.REFRESH_TOKEN_SECRET!,
            {
                expiresIn: REFRESH_TOKEN_EXPIRY,
            },
        );
    } catch (e) {
        throw new ApiError(500, "Failed to generate refresh token");
    }
};

const verifyToken = (refreshToken: string): UserTokenPayload => {
    try {
        return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as UserTokenPayload;
    } catch (e) {
        throw new ApiError(403, "Invalid refresh token");
    }
};

export const userSignup = async (
    req: ValidatedRequest<{ body: typeof UserSignupSchema }>,
    res: Response,
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

        return res.status(201).json({ status: "success", code: 201, message: "User created successfully" });
    } catch (e) {
        next(e);
    }
};

export const userLogin = async (
    req: ValidatedRequest<{ body: typeof UserLoginSchema }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const [user] = await DB().query<UserEntity>("SELECT * FROM users WHERE email = $1;", [req.body.email]);

        if (!user) {
            throw new ApiError(400, "Invalid email or password");
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordCorrect || !user) {
            throw new ApiError(400, "Invalid email or password");
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        refreshTokens.push(refreshToken);

        return res.status(200).json({
            status: "success",
            code: 200,
            message: "Login successful",
            data: { username: user.username, accessToken, refreshToken },
        });
    } catch (e) {
        next(e);
    }
};

export const fetchAccessToken = (
    req: ValidatedRequest<{ body: typeof UserTokenSchema }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const refreshToken = req.body.token;

        if (!refreshToken) {
            throw new ApiError(400, "No token provided");
        }

        if (!refreshTokens.includes(refreshToken)) {
            throw new ApiError(403, "Invalid refresh token");
        }

        const user = verifyToken(refreshToken);
        const accessToken = generateAccessToken(user);

        return res.status(200).json({
            status: "success",
            code: 200,
            message: "Access token generated successfully",
            data: { accessToken },
        });
    } catch (e) {
        next(e);
    }
};
