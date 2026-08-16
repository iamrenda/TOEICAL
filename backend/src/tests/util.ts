import supertest from "supertest";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import app from "../index.ts";
import DB from "../db/db.ts";
import { randomBytes } from "crypto";

dotenv.config();

export const TEST_USER = {
    id: 99,
    username: "testing",
    email: "test@example.com",
    password: "password",
};

export const getRandomEmail = () => `${Date.now()}@test.com`;
export const getRandomUsername = (length = 10) => randomBytes(length).toString("hex").slice(0, length);

export const getTestUserId = async () => {
    try {
        const [user] = await DB().query<{ id: number }>("SELECT id FROM users WHERE email = $1", [TEST_USER.email]);
        return user!.id;
    } catch (e) {
        console.error("failed to get test users' id", e);
    }
};

export const getValidAccessToken = async () => {
    const res = await supertest(app).post("/auth/login").send({
        email: TEST_USER.email,
        password: TEST_USER.password,
    });

    return res.body.data.accessToken;
};

export const getValidRefreshToken = async () => {
    const res = await supertest(app).post("/auth/login").send({
        email: TEST_USER.email,
        password: TEST_USER.password,
    });

    return res.body.data.refreshToken;
};

export const getExpiredRefreshToken = async () =>
    jwt.sign({ userId: await getTestUserId() }, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: "-10s",
    });

export const getRevokedRefreshToken = async () => {
    const refreshToken = await getValidRefreshToken();

    await supertest(app).post("/auth/logout").send({ token: refreshToken });

    return refreshToken;
};
