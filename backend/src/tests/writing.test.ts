import dotenv from "dotenv";
import app from "../index.ts";
import supertest from "supertest";
import DB from "../db/db.ts";
import api from "../api/api.ts";
import { getTestUserId, getValidAccessToken } from "./util.ts";
import { WritingResponseSchema } from "@toeical/shared";
import { TEST_WRITING_DIFFICULTIES, TEST_WRITING_TAGS, TEST_WRITING_TOPICS } from "./constants.ts";

dotenv.config();

jest.mock("../api/api.ts", () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
        get: jest.fn(),
    },
}));

const mockedApi = jest.mocked(api);

const getValidWritingRequestBody = () => {
    const randomTopicData = TEST_WRITING_TOPICS[Math.floor(Math.random() * TEST_WRITING_TOPICS.length)]!;

    const seed = {
        essay: "This is a sample essay for testing purposes. It should be long enough to meet the recommended word count and provide a coherent argument or narrative. The content of this essay is not important, as it is only meant to test the functionality of the writing API endpoint.",
        timeTaken: 10,
    };

    return {
        topic: randomTopicData.topic,
        topicId: randomTopicData.id,
        description: randomTopicData.description,
        difficulty: randomTopicData.difficulty,
        timeLimit: randomTopicData.limit_time_minutes,
        wordCount: randomTopicData.recommended_word_count,
        ...seed,
    };
};

describe("POST /api/writing", () => {
    let accessToken: string;

    beforeAll(async () => {
        accessToken = await getValidAccessToken();
    });

    describe("HAPPY PATH - when valid queries are given", () => {
        test("should respond with a 200 status code", async () => {
            // fake successful api response from fast api (/ai/writing/analysis)
            mockedApi.post.mockResolvedValueOnce({
                data: {
                    status: "success",
                    data: {
                        structure_score: 67,
                        topic_relevancy_score: 67,
                        grammar_score: 67,
                        vocabulary_score: 67,
                        overall_score: 67,
                        revised_essay: "This is revised essay",
                        feedback_summary: "This is feedback summary",
                    },
                },
            });

            const validRequestBody = await getValidWritingRequestBody();

            const res = await supertest(app)
                .post("/api/writing")
                .set("Authorization", `Bearer ${accessToken}`)
                .send(validRequestBody);

            expect(res.status).toBe(200);
            expect(WritingResponseSchema.safeParse(res.body.data).success).toBe(true);

            // the payload forwarded to fast api
            expect(mockedApi.post).toHaveBeenCalledWith("/ai/writing/analysis", {
                topic: validRequestBody.topic,
                description: validRequestBody.description,
                essay: validRequestBody.essay,
                difficulty: validRequestBody.difficulty,
                timeLimit: validRequestBody.timeLimit,
                timeTaken: validRequestBody.timeTaken,
                wordCount: validRequestBody.wordCount,
            });

            // the analysis is persisted and linked to the requesting user
            const rows = await DB().query<{
                user_id: number;
                writing_topic_id: number;
                writing_content: string;
                overall_score: number;
            }>(
                `
                SELECT uw.user_id, uw.writing_topic_id, uw.writing_content, wr.overall_score
                FROM users_writing AS uw
                INNER JOIN writing_results AS wr
                ON uw.writing_results_id = wr.id;
                `,
            );

            expect(rows).toHaveLength(1);
            expect(rows[0]).toEqual({
                user_id: await getTestUserId(),
                writing_topic_id: validRequestBody.topicId,
                writing_content: "This is revised essay",
                overall_score: 67,
            });
        });
    });

    describe("SAD PATH - when invalid queries are given", () => {
        test("should respond with a 400 status code", async () => {
            const validRequestBody = getValidWritingRequestBody();
            const invalidBodies = [
                {},
                { topic: "test" },
                { description: "test" },
                { essay: "test" },
                { difficulty: "EASY" },
                { timeLimit: 10 },
                { timeTaken: 10 },
                { wordCount: 100 },
                { ...validRequestBody, difficulty: "INVALID_DIFFICULTY" },
            ];

            for (const invalidBody of invalidBodies) {
                const res = await supertest(app)
                    .post("/api/writing")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(invalidBody);

                expect(res.status).toBe(400);
            }
        });
    });

    describe("SAD PATH - when the external API fails", () => {
        test("should respond with a 500 status code", async () => {
            mockedApi.post.mockRejectedValueOnce(new Error("External API failed"));

            const validRequestBody = getValidWritingRequestBody();

            const res = await supertest(app)
                .post("/api/writing")
                .set("Authorization", `Bearer ${accessToken}`)
                .send(validRequestBody);

            expect(res.status).toBe(500);
        });
    });

    afterAll(async () => {
        await DB().query("TRUNCATE TABLE writing_results, users_writing RESTART IDENTITY CASCADE;");
    });
});

describe("GET /api/writing/topics", () => {
    let accessToken: string;

    beforeAll(async () => {
        accessToken = await getValidAccessToken();
    });

    describe("HAPPY PATH - when valid queries are given", () => {
        test("should respond with a 200 status code", async () => {
            const validQueries: {
                difficulty: (typeof TEST_WRITING_DIFFICULTIES)[number] | "ALL";
                tag: (typeof TEST_WRITING_TAGS)[number] | "ALL";
            }[] = [
                { difficulty: "ALL", tag: "ALL" },
                { difficulty: "EASY", tag: "ALL" },
                { difficulty: "MEDIUM", tag: "daily-life" },
                { difficulty: "HARD", tag: "reflection" },
            ];

            for (const query of validQueries) {
                const res = await supertest(app)
                    .get("/api/writing/topics")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .query(query);

                expect(res.status).toBe(200);
            }
        });
    });

    describe("SAD PATH - when invalid queries are given", () => {
        test("should repond with a 400 status code", async () => {
            const invalidQueries: {
                difficulty: string;
                tag: string;
            }[] = [
                { difficulty: "INVALID_DIFFICULTY", tag: "ALL" },
                { difficulty: "ALL", tag: "INVALID_TAG" },
                { difficulty: "INVALID_DIFFICULTY", tag: "INVALID_TAG" },
            ];

            for (const query of invalidQueries) {
                const res = await supertest(app)
                    .get("/api/writing/topics")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .query(query);

                expect(res.status).toBe(400);
            }
        });
    });
});

describe("GET /api/writing/history", () => {
    let accessToken: string;

    beforeAll(async () => {
        accessToken = await getValidAccessToken();
    });

    describe("HAPPY PATH - when valid queries are given", () => {
        test("should respond with a 200 status code", async () => {
            const validRequestQueries = [{ from: "2023-01-01", to: "2023-12-31" }];

            for (const query of validRequestQueries) {
                const res = await supertest(app)
                    .get("/api/writing/history")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .query(query);
                expect(res.status).toBe(200);
            }
        });
    });

    describe("SAD PATH - when invalid queries are given", () => {
        test("should respond with a 400 status code", async () => {
            const invalidRequestQueries = [
                { from: "2023-01-01" },
                { to: "2023-12-31" },
                { from: "invalid-date", to: "2023-12-31" },
                { from: "2023-01-01", to: "invalid-date" },
            ];

            for (const query of invalidRequestQueries) {
                const res = await supertest(app)
                    .get("/api/writing/history")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .query(query);

                expect(res.status).toBe(400);
            }
        });
    });
});
