import jwt from "jsonwebtoken";
import ApiError from "../util/ApiError.ts";
import type { Request, Response, NextFunction } from "express";
import type { UserTokenPayload } from "../types/User.ts";
import { env } from "../config/env.ts";

const verifyToken = (accessToken: string): UserTokenPayload => {
    try {
        return jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET) as UserTokenPayload;
    } catch (e) {
        throw new ApiError(401, "Invalid token");
    }
};

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
        throw new ApiError(401, "Access token required");
    }

    try {
        req.user = verifyToken(token);
        next();
    } catch (e) {
        throw new ApiError(401, "Invalid token");
    }
};

export default authenticateToken;
