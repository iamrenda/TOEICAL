import dotenv from "dotenv";
import app from "../index.ts";
import supertest from "supertest";
import DB from "../db/db.ts";
import { getTestUserId, getValidAccessToken } from "./util.ts";

dotenv.config();

const getValidQuestionId = async () => {
    const [q] = await DB().query<{ id: number }>("SELECT id FROM question ORDER BY id LIMIT 1;");
    return q!.id;
};

describe("GET /overview", () => {
    let accessToken: string;

    beforeAll(async () => {
        accessToken = await getValidAccessToken();
    });

    describe("HAPPY PATH - when valid queries are given (sortBy, limit, page, starred)", () => {
        test("should respond with a 200 status code and return an array of QuestionOverview", async () => {
            const validQueries = [
                { sortBy: "id.asc", limit: 10, page: 1, starred: false },
                { sortBy: "id.desc", limit: 10, page: 1, starred: true },
                { sortBy: "id.asc", limit: 100, page: 10, starred: true },
                { sortBy: "id.asc", limit: 10, page: 10000, starred: true },
                { sortBy: "starred_date.asc", limit: 10, page: 1, starred: false },
                { sortBy: "starred_date.desc", limit: 10, page: 1, starred: true },
                { sortBy: "starred_date.asc", limit: 100, page: 10, starred: true },
                { sortBy: "starred_date.asc", limit: 10, page: 10000, starred: true },
            ];
            for (const query of validQueries) {
                const res = await supertest(app)
                    .get("/api/question/overview")
                    .query(query)
                    .set("Authorization", `Bearer ${accessToken}`);

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body.data)).toBe(true);

                if (res.body.length > 0) {
                    const questionData = res.body.data[0];

                    expect(questionData).toEqual(
                        expect.objectContaining({
                            id: expect.any(Number),
                            question: expect.any(String),
                            is_starred: expect.any(Boolean),
                            was_last_attempt_correct: expect.any(Boolean),
                            last_answered_at: expect.any(String),
                        }),
                    );
                }
            }
        });
    });

    describe("SAD PATH - when invalid queries are given", () => {
        test("should respond with a 400 status code", async () => {
            const invalidQueries = [
                {}, // empty query
                { limit: 10, page: 1, starred: false }, // no sortBy
                { sortBy: "id.asc", page: 1, starred: false }, // no limit
                { sortBy: "id.asc", limit: 10, starred: false }, // no page
                { sortBy: "id.asc", limit: 10, page: 1 }, // no starred bool
                { sortBy: "id.asc", limit: 10, page: -1, starred: false }, // negative page
                { sortBy: "id.asc", limit: -10, page: 11, starred: false }, // negative limit
                { sortBy: "not-a-sortby", limit: 1, page: -1, starred: false }, // invalid sortBy
            ];

            for (const query of invalidQueries) {
                const res = await supertest(app)
                    .get("/api/question/overview")
                    .query(query)
                    .set("Authorization", `Bearer ${accessToken}`);
                expect(res.status).toBe(400);
            }
        });
    });
});

describe("GET /random", () => {
    let accessToken: string;

    beforeAll(async () => {
        accessToken = await getValidAccessToken();

        // seeding starred and wrong question
        const testUserId = await getTestUserId();
        await DB().query(`INSERT INTO answer_history (user_id, question_id, was_correct) VALUES ($1, 1, false);`, [
            testUserId!,
        ]);
        const validQuestionId = await getValidQuestionId();
        await DB().query("INSERT INTO starred_question (user_id, question_id) VALUES ($1, $2);", [
            testUserId,
            validQuestionId,
        ]);
    });

    describe("HAPPY PATH - when valid queries are given", () => {
        test("should respond with a 200 status code and return an array of Question (Quetsion.option should have exact 4 Option elements)", async () => {
            const validQueries = [
                {
                    type: "random",
                    count: 1,
                },
                {
                    type: "starred",
                    count: 1,
                },
                {
                    type: "unanswered",
                    count: 1,
                },
                {
                    type: "wrong",
                    count: 1,
                },
                {
                    type: "random",
                    count: 10,
                },
            ];
            for (const query of validQueries) {
                const res = await supertest(app)
                    .get("/api/question/random")
                    .query(query)
                    .set("Authorization", `Bearer ${accessToken}`);

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body.data)).toBe(true);
                if (res.body.data.length > 1) {
                    const questionData = res.body.data[0];

                    expect(questionData).toEqual(
                        // Question type
                        expect.objectContaining({
                            id: expect.any(Number),
                            question: expect.any(String),
                            is_starred: expect.any(Boolean),
                            correct_option_id: expect.any(Number),
                            translated_question: expect.any(String),
                            type_description: expect.any(String),
                            options: expect.any(Array),
                            ...(res.body.data.detailed_descriptions && { detailed_descriptions: expect.any(Array) }),
                            ...(res.body.data.translated_vocabs && { translated_vocabs: expect.any(Array) }),
                        }),
                    );
                    expect(questionData.options).toHaveLength(4);
                    questionData.options.forEach((optionObject: any) => {
                        expect(optionObject).toEqual({
                            option: expect.any(String),
                            option_id: expect.any(Number),
                            translated_option: expect.any(String),
                        });
                    });
                }
            }
        });
    });

    describe("SAD PATH - when invalid queries are given", () => {
        test("should respond with a 400 status code", async () => {
            const invalidQueries = [
                {}, // empty query
                { count: 1 }, // no types
                { type: "random" }, // no count
                { type: "random", count: -1 }, // negative count
                { type: "not-a-type" }, // invalid type
            ];
            for (const query of invalidQueries) {
                const res = await supertest(app)
                    .get("/api/question/random")
                    .query(query)
                    .set("Authorization", `Bearer ${accessToken}`);

                expect(res.status).toBe(400);
            }
        });
    });

    describe("EDGE CASE - when requested questions more than possible", () => {
        test("should respond with a 200 status code and return any available questions", async () => {
            const invalidQueries = [
                { type: "random", count: 10000 }, // more than total questions
                { type: "starred", count: 10000 }, // more than total starred questions
                { type: "unanswered", count: 10000 }, // more than total unanswered questions
                { type: "wrong", count: 10000 }, // more than total wrong questions
            ];
            for (const query of invalidQueries) {
                const res = await supertest(app)
                    .get("/api/question/random")
                    .query(query)
                    .set("Authorization", `Bearer ${accessToken}`);

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body.data)).toBe(true);

                if (res.body.data.length > 0) {
                    const questionData = res.body.data[0];

                    expect(questionData).toEqual(
                        // Question type
                        expect.objectContaining({
                            id: expect.any(Number),
                            question: expect.any(String),
                            is_starred: expect.any(Boolean),
                            correct_option_id: expect.any(Number),
                            translated_question: expect.any(String),
                            type_description: expect.any(String),
                            options: expect.any(Array),
                            ...(res.body.data.detailed_descriptions && { detailed_descriptions: expect.any(Array) }),
                            ...(res.body.data.translated_vocabs && { translated_vocabs: expect.any(Array) }),
                        }),
                    );
                    expect(questionData.options).toHaveLength(4);
                    questionData.options.forEach((optionObject: any) => {
                        expect(optionObject).toEqual({
                            option: expect.any(String),
                            option_id: expect.any(Number),
                            translated_option: expect.any(String),
                        });
                    });
                }
            }
        });
    });

    afterAll(async () => {
        // deleting seeds
        await DB().query(`TRUNCATE TABLE answer_history RESTART IDENTITY CASCADE;`);
        await DB().query(`TRUNCATE TABLE starred_question RESTART IDENTITY CASCADE;`);
    });
});

describe("GET /count", () => {
    let accessToken: string;

    beforeAll(async () => {
        accessToken = await getValidAccessToken();
    });

    test("HAPPY PATH - should return data with an array with objects", async () => {
        const res = await supertest(app).get("/api/question/count").set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual(
            expect.objectContaining({
                all: expect.any(Number),
                answered: expect.any(Number),
                starred: expect.any(Number),
                last_answered_wrong: expect.any(Number),
            }),
        );
    });
});

describe("GET /:questionId", () => {
    let accessToken: string;

    beforeAll(async () => {
        accessToken = await getValidAccessToken();
    });

    describe("HAPPY PATH - when valid question id is given", () => {
        test("should respond with a 200 status code and return an array with Question (same as /random)", async () => {
            const validQuestionId = await getValidQuestionId();
            const res = await supertest(app)
                .get(`/api/question/${validQuestionId}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    question: expect.any(String),
                    is_starred: expect.any(Boolean),
                    correct_option_id: expect.any(Number),
                    translated_question: expect.any(String),
                    type_description: expect.any(String),
                    options: expect.any(Array),
                    ...(res.body.data.detailed_descriptions && { detailed_descriptions: expect.any(Array) }),
                    ...(res.body.data.translated_vocabs && { translated_vocabs: expect.any(Array) }),
                }),
            );
            expect(res.body.data.options).toHaveLength(4);
            res.body.data.options.forEach((optionObject: any) => {
                expect(optionObject).toEqual({
                    option: expect.any(String),
                    option_id: expect.any(Number),
                    translated_option: expect.any(String),
                });
            });
        });
    });

    describe("SAD PATH - when invalid question id is given", () => {
        test("should respond with a 400 status code", async () => {
            const invalidQuestionIds = ["abc", -1, 0, 1.5]; // invalid types and values
            for (const questionId of invalidQuestionIds) {
                const res = await supertest(app)
                    .get(`/api/question/${questionId}`)
                    .set("Authorization", `Bearer ${accessToken}`);
                expect(res.status).toBe(400);
            }
        });
    });

    describe("SAD PATH - when question with given id are not found", () => {
        test("should respond with a 404 status code", async () => {
            const res = await supertest(app).get(`/api/question/9999999`).set("Authorization", `Bearer ${accessToken}`);
            expect(res.status).toBe(404);
        });
    });
});

describe("GET /:questionId/next", () => {
    let accessToken: string;

    beforeAll(async () => {
        accessToken = await getValidAccessToken();
        // seeding (starred question id: 1 and 2)
        const testUserId = await getTestUserId();
        await DB().query("INSERT INTO starred_question (user_id, question_id) VALUES ($1, $2);", [testUserId, 1]);
        await DB().query("INSERT INTO starred_question (user_id, question_id) VALUES ($1, $2);", [testUserId, 2]);
    });

    describe("HAPPY PATH - when valid question id is given", () => {
        test("should respond with a 200 status code and return an array with Question (same as /random)", async () => {
            const validOptions = [
                { questionId: 1, query: { sortBy: "id.asc", starred: false } },
                { questionId: 2, query: { sortBy: "id.desc", starred: true } },
                { questionId: 1, query: { sortBy: "starred_date.asc", starred: false } },
                { questionId: 2, query: { sortBy: "starred_date.desc", starred: true } },
            ];

            for (const { questionId, query } of validOptions) {
                // ID 1 and 2 is guaranteed to exist in the test database
                const res = await supertest(app)
                    .get(`/api/question/${questionId}/next`)
                    .query(query)
                    .set("Authorization", `Bearer ${accessToken}`);

                expect(res.status).toBe(200);
                expect(res.body.data).toEqual(
                    expect.objectContaining({
                        id: expect.any(Number),
                        question: expect.any(String),
                        is_starred: expect.any(Boolean),
                        correct_option_id: expect.any(Number),
                        translated_question: expect.any(String),
                        type_description: expect.any(String),
                        options: expect.any(Array),
                        ...(res.body.data.detailed_descriptions && { detailed_descriptions: expect.any(Array) }),
                        ...(res.body.data.translated_vocabs && { translated_vocabs: expect.any(Array) }),
                    }),
                );
                expect(res.body.data.options).toHaveLength(4);
                res.body.data.options.forEach((optionObject: any) => {
                    expect(optionObject).toEqual({
                        option: expect.any(String),
                        option_id: expect.any(Number),
                        translated_option: expect.any(String),
                    });
                });
            }
        });
    });

    describe("SAD PATH - when invalid question id is given", () => {
        test("should respond with a 400 status code", async () => {
            const invalidQuestionIds = ["abc", -1, 0, 1.5]; // invalid types and values
            for (const questionId of invalidQuestionIds) {
                const res = await supertest(app)
                    .get(`/api/question/${questionId}/next`)
                    .set("Authorization", `Bearer ${accessToken}`);
                expect(res.status).toBe(400);
            }
        });
    });

    describe("SAD PATH - when invalid queries are given", () => {
        test("should respond with a 400 status code", async () => {
            const invalidQueries = [
                { sortBy: "not-a-sortby", starred: false }, // invalid sortBy
                { sortBy: "id.asc", starred: "not-a-bool" }, // invalid starred
            ];
            for (const query of invalidQueries) {
                const res = await supertest(app)
                    .get(`/api/question/1/next`)
                    .query(query)
                    .set("Authorization", `Bearer ${accessToken}`);
                expect(res.status).toBe(400);
            }
        });
    });

    describe("SAD PATH - when next question is not found", () => {
        test("should respond with a 404 status code", async () => {
            const res = await supertest(app)
                .get(`/api/question/9999999/next`)
                .query({ sortBy: "id.asc", starred: false })
                .set("Authorization", `Bearer ${accessToken}`);
            expect(res.status).toBe(404);
        });
    });

    afterAll(async () => {
        // deleting seeds
        await DB().query(`TRUNCATE TABLE starred_question RESTART IDENTITY CASCADE;`);
    });
});

describe("POST /question/history/:questionId", () => {
    let accessToken: string;

    beforeAll(async () => {
        accessToken = await getValidAccessToken();
    });

    describe("HAPPY PATH - when valid question id and body is given", () => {
        test("should respond with a 201 status code", async () => {
            const res = await supertest(app)
                .post("/api/question/history/1")
                .send({ wasCorrect: true })
                .set("Authorization", `Bearer ${accessToken}`);
            expect(res.status).toBe(201);
        });
    });

    describe("SAD PATH - when invalid question id is given", () => {
        test("should respond with a 400 status code", async () => {
            const res = await supertest(app)
                .post("/api/question/history/invalid-id")
                .send({ wasCorrect: true })
                .set("Authorization", `Bearer ${accessToken}`);
            expect(res.status).toBe(400);
        });
    });

    describe("SAD PATH - when invalid body are given", () => {
        test("should respond with a 400 status code", async () => {
            const res = await supertest(app)
                .post("/api/question/history/1")
                .send({ wasCorrect: "not-a-boolean" })
                .set("Authorization", `Bearer ${accessToken}`);
            expect(res.status).toBe(400);
        });
    });

    describe("SAD PATH - when question is not found", () => {
        test("should respond with a 404 status code", async () => {
            const res = await supertest(app)
                .post("/api/question/history/9999999")
                .send({ wasCorrect: true })
                .set("Authorization", `Bearer ${accessToken}`);
            expect(res.status).toBe(404);
        });
    });
});

describe("POST /question/starred/:questionId", () => {
    let accessToken: string;

    beforeAll(async () => {
        accessToken = await getValidAccessToken();
    });

    describe("HAPPY PATH - when valid question id is given", () => {
        test("should respond with a 201 status code", async () => {
            const validQuestionId = await getValidQuestionId();
            const res = await supertest(app)
                .post(`/api/question/starred/${validQuestionId}`)
                .set("Authorization", `Bearer ${accessToken}`);
            expect(res.status).toBe(201);
        });
    });

    describe("ALTERNATIVE PATH - when question is already starred", () => {
        test("should respond with a 201 status code", async () => {
            const testUserId = await getTestUserId();
            const validQuestionId = await getValidQuestionId();

            // seed: star the question
            await DB().query(
                "INSERT INTO starred_question (user_id, question_id) VALUES ($1, $2) ON CONFLICT (user_id, question_id) DO NOTHING;",
                [testUserId, validQuestionId],
            );

            // test: try to star it again
            const res = await supertest(app)
                .post(`/api/question/starred/${validQuestionId}`)
                .set("Authorization", `Bearer ${accessToken}`);
            expect(res.status).toBe(201);
        });
    });

    describe("SAD PATH - when invalid question id is given", () => {
        test("should respond with a 400 status code", async () => {
            const res = await supertest(app)
                .post("/api/question/starred/invalid-id")
                .set("Authorization", `Bearer ${accessToken}`);
            expect(res.status).toBe(400);
        });
    });

    describe("SAD PATH - when question is not found", () => {
        test("should respond with a 404 status code", async () => {
            const res = await supertest(app)
                .post("/api/question/starred/9999999")
                .set("Authorization", `Bearer ${accessToken}`);
            expect(res.status).toBe(404);
        });
    });
});

describe("DELETE /question/starred/:questionId", () => {
    let accessToken: string;

    beforeAll(async () => {
        accessToken = await getValidAccessToken();
    });

    describe("HAPPY PATH - when valid question id is given", () => {
        test("should respond with a 200 status code", async () => {
            const testUserId = await getTestUserId();
            const validQuestionId = await getValidQuestionId();

            // seed: star the question
            await DB().query("DELETE FROM starred_question WHERE user_id = $1 AND question_id = $2;", [
                testUserId,
                validQuestionId,
            ]);

            // test: unstar the question
            const res = await supertest(app)
                .delete(`/api/question/starred/${validQuestionId}`)
                .set("Authorization", `Bearer ${accessToken}`);
            expect(res.status).toBe(200);
        });
    });

    describe("ALTERNATIVE PATH - when question is already unstarred", () => {
        test("should respond with a 200 status code", async () => {
            const validQuestionId = await getValidQuestionId();
            // seed: unstar the question (in case it was starred)
            await DB().query("DELETE FROM starred_question WHERE question_id = $1;", [validQuestionId]);

            // test: unstar it again
            const res = await supertest(app)
                .delete(`/api/question/starred/${validQuestionId}`)
                .set("Authorization", `Bearer ${accessToken}`);
            expect(res.status).toBe(200);
        });
    });

    describe("SAD PATH - when invalid question id is given", () => {
        test("should respond with a 400 status code", async () => {
            const res = await supertest(app)
                .delete("/api/question/starred/invalid-id")
                .set("Authorization", `Bearer ${accessToken}`);
            expect(res.status).toBe(400);
        });
    });

    describe("SAD PATH - when question is not found", () => {
        test("should respond with a 404 status code", async () => {
            const res = await supertest(app)
                .delete("/api/question/starred/9999999")
                .set("Authorization", `Bearer ${accessToken}`);
            expect(res.status).toBe(404);
        });
    });
});
