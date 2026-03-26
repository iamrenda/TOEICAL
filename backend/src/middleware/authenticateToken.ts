import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { UserTokenPayload } from "../types/User.ts";

dotenv.config();

const verifyToken = (accessToken: string): UserTokenPayload => {
    try {
        return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as UserTokenPayload;
    } catch (e) {
        throw new Error("Invalid token");
    }
};

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: "Access token required" });
    }

    try {
        req.user = verifyToken(token);
        next();
    } catch (e) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

export default authenticateToken;
