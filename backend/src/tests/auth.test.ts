import supertest from "supertest";
import app from "../index.ts";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import DB from "../db/db.ts";
import { TEST_USER } from "./seed.ts";
import { randomBytes } from "crypto";

dotenv.config();

const randomEmail = () => `${Date.now()}@test.com`;
const randomUsername = (length = 10) => randomBytes(length).toString("hex").slice(0, length);

const getTestUserId = async () => {
    const [user] = await DB().query<{ id: number }>("SELECT id FROM users WHERE email = $1", [TEST_USER.email]);
    return user!.id;
};

const validRefreshToken = async () => {
    const login = await supertest(app)
        .post("/auth/login")
        .send({ email: TEST_USER.email, password: TEST_USER.password });
    return login.body.data.refreshToken;
};

const expiredRefreshToken = async () =>
    jwt.sign({ userId: await getTestUserId() }, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: "-10s",
    });

const revokedRefreshToken = async () => {
    const refreshToken = await validRefreshToken();

    await supertest(app).post("/auth/logout").send({ token: refreshToken });

    return refreshToken;
};

describe("POST /auth/signup", () => {
    describe("when valid username, email and password are given", () => {
        test("should respond with a 201 status code", async () => {
            const response = await supertest(app).post("/auth/signup").send({
                username: randomUsername(),
                email: randomEmail(),
                password: "password",
            });
            expect(response.statusCode).toBe(201);
        });
    });

    describe("when the username has already exist", () => {
        test("should respond with 409 status code", async () => {
            const response = await supertest(app).post("/auth/signup").send({
                username: "username",
                email: randomEmail(),
                password: "password",
            });
            expect(response.statusCode).toBe(409);
        });
    });

    describe("when the email does not follow email format", () => {
        test("should respond with 400 status code", async () => {
            const salt = Date.now();
            const testEmails = [`test_${salt}`, `test_${salt}@`, `test_${salt}.com`, `test_${salt}@.com`, ""];

            for (const email of testEmails) {
                const response = await supertest(app).post("/auth/signup").send({
                    username: randomUsername(),
                    email,
                    password: "password",
                });
                expect(response.statusCode).toBe(400);
            }
        });
    });

    describe("when the username, email or password is missing", () => {
        test("should respond with 400 status code", async () => {
            const testBody = [
                { username: randomUsername() },
                { username: randomUsername() },
                { password: "password" },
                { username: randomUsername(), password: "password" },
                { username: randomUsername(), email: randomEmail() },
                { password: "password", email: randomEmail() },
                {},
            ];

            for (const body of testBody) {
                const response = await supertest(app).post("/auth/signup").send(body);
                expect(response.statusCode).toBe(400);
            }
        });
    });
});

describe("POST /auth/login", () => {
    describe("when valid and correct email and password are given", () => {
        test("should respond with a 200 status code", async () => {
            const response = await supertest(app).post("/auth/login").send({
                email: TEST_USER.email,
                password: TEST_USER.password,
            });
            expect(response.statusCode).toBe(200);
        });
    });

    describe("when the email or password is missing", () => {
        test("should respond with a 400 status code", async () => {
            const testBody = [
                { email: "testing@example" },
                { password: "password" },
                { username: "testing" },
                { username: "testing", password: "password" },
                {},
            ];

            for (const body of testBody) {
                const response = await supertest(app).post("/auth/signup").send(body);
                expect(response.statusCode).toBe(400);
            }
        });
    });

    describe("when the email or password is wrong", () => {
        test("should respond with a 400 status code", async () => {
            const response = await supertest(app).post("/auth/login").send({
                email: "testing@example.com",
                password: "wrongpassword",
            });
            expect(response.statusCode).toBe(400);
        });
    });
});

describe("POST /auth/token", () => {
    describe("when the refresh token is valid", () => {
        let refreshToken: string;

        beforeEach(async () => {
            const loginResponse = await supertest(app)
                .post("/auth/login")
                .send({ email: TEST_USER.email, password: TEST_USER.password });

            expect(loginResponse.statusCode).toBe(200);

            refreshToken = loginResponse.body.data.refreshToken;
        });

        test("should respond with a status code of 200", async () => {
            const response = await supertest(app).post("/auth/token").send({
                token: refreshToken,
            });
            expect(response.statusCode).toBe(200);
        });

        test("should include access token in the response body", async () => {
            const response = await supertest(app).post("/auth/token").send({
                token: refreshToken,
            });
            expect(response.body.data.accessToken).toBeDefined();
        });
    });

    describe("when the refresh token is invalid", () => {
        test("should respond with a status code of 401", async () => {
            const response = await supertest(app).post("/auth/token").send({
                token: "abcdefg",
            });
            expect(response.statusCode).toBe(401);
        });
    });

    describe("when the refresh token is expired", () => {
        test("should respond with a status code of 401", async () => {
            const expiredToken = jwt.sign({ userId: await getTestUserId() }, process.env.REFRESH_TOKEN_SECRET!, {
                expiresIn: "-10s",
            });
            const response = await supertest(app).post("/auth/token").send({
                token: expiredToken,
            });
            expect(response.statusCode).toBe(401);
        });
    });

    describe("when the refresh token is not given", () => {
        test("should respond with a status code of 400", async () => {
            const response = await supertest(app).post("/auth/token").send({});
            expect(response.statusCode).toBe(400);
        });
    });

    describe("when the refresh token is revoked", () => {
        test("should respond with a status code of 401", async () => {
            const token = await revokedRefreshToken();

            const response = await supertest(app).post("/auth/token").send({
                token,
            });
            expect(response.statusCode).toBe(401);
        });
    });
});

describe("POST /auth/logout", () => {
    describe("when the token is provided", () => {
        test("should respond with a status code of 200", async () => {
            const token = await validRefreshToken();
            const response = await supertest(app).post("/auth/logout").send({
                token,
            });
            expect(response.statusCode).toBe(200);
        });

        // test("the token is revoked", async () => {});
    });

    describe("when the body is invalid", () => {
        test("should respond with a status code of 400", async () => {
            const testBody = [{}, { token: "" }];
            for (const body of testBody) {
                const response = await supertest(app).post("/auth/logout").send(body);
                expect(response.statusCode).toBe(400);
            }
        });
    });

    describe("when the token is invalid", () => {
        test("should respond with a status code of 401", async () => {
            const response = await supertest(app).post("/auth/logout").send({ token: "not-a-jwt" });
            expect(response.statusCode).toBe(401);
        });
    });

    describe("when the token is revoked", () => {
        test("should respond with a status code of 200 (idempotent)", async () => {
            const token = await revokedRefreshToken();

            const response = await supertest(app).post("/auth/logout").send({ token });
            expect(response.statusCode).toBe(200);
        });
    });

    describe("when the token is already expired", () => {
        test("should respond with a status code of 401", async () => {
            const token = await expiredRefreshToken();

            const response = await supertest(app).post("/auth/logout").send({ token });
            expect(response.statusCode).toBe(401);
        });
    });
});
