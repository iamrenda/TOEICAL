import type { Response } from "express";
import type { ValidatedRequest } from "express-zod-safe";
import type { UserLoginSchema, UserSignupSchema, UserTokenSchema } from "../../schemas/users.schema.ts";
import type { UserTokenPayload, UserEntity } from "../../types/User.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import DB from "../../db/api.ts";
import handleError from "../../util/handleError.ts";

dotenv.config();

const refreshTokens: string[] = [];

const generateAccessToken = (user: UserTokenPayload) => {
    return jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "30m",
    });
};

const generateRefreshToken = (user: UserEntity) => {
    return jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.REFRESH_TOKEN_SECRET!);
};

const verifyToken = (refreshToken: string): UserTokenPayload => {
    try {
        return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as UserTokenPayload;
    } catch (e) {
        console.log(e);
        throw new Error("invalid token");
    }
};

export const userSignup = async (req: ValidatedRequest<{ body: typeof UserSignupSchema }>, res: Response) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10); // 10 is the amount of salt
        const user = { username: req.body.username, email: req.body.email, password: hashPassword };

        await DB().query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3);", [
            user.username,
            user.email,
            user.password,
        ]);

        return res.sendStatus(201);
    } catch (e) {
        handleError(e, res);
    }
};

export const userLogin = async (req: ValidatedRequest<{ body: typeof UserLoginSchema }>, res: Response) => {
    try {
        const [user] = await DB().query<UserEntity>("SELECT * FROM users WHERE email = $1;", [req.body.email]);

        if (!user) {
            return res.status(400).json({ reason: "User not found." });
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordCorrect) {
            return res.sendStatus(403);
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        refreshTokens.push(refreshToken);

        return res.status(200).send({ accessToken, refreshToken });
    } catch (e) {
        return res.sendStatus(500);
    }
};

export const fetchAccessToken = (req: ValidatedRequest<{ body: typeof UserTokenSchema }>, res: Response) => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
    }

    try {
        const user = verifyToken(refreshToken);
        const accessToken = generateAccessToken(user);

        return res.status(200).json({ accessToken });
    } catch (e) {
        return res.sendStatus(403);
    }
};
