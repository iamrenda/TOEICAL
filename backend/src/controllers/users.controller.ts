import type { Request, Response } from "express";
import { z } from "zod";
import DB from "../db/api.ts";
import handleError from "../util/handleError.ts";
import type { User } from "../types/User.ts";
import type { UserHistoryBody, UserBody } from "../schemas/users.schema.ts";

type UserStarredQuestion = {
    id: number;
    question: string;
    last_attempt_correct: boolean;
    last_answered_at: string;
};

const UserParamsSchema = z.object({
    userId: z.coerce.number().min(1),
});

const UserQuestionParamsSchema = z.object({
    questionId: z.coerce.number().min(1),
    userId: z.coerce.number().min(1),
});

const StarredQuestionQuery = z.object({
    sortBy: z.string(),
    limit: z.coerce.number(),
    page: z.coerce.number().min(1),
});

export const createUser = async (req: Request, res: Response) => {
    const { username }: UserBody = req.body;

    try {
        await DB().query("INSERT INTO users (username) VALUES ($1)", [username]);
        return res.sendStatus(201);
    } catch (e) {
        handleError(e, res);
    }
};

export const getUser = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        const data = await DB().query<User>("SELECT * FROM users WHERE username = $1", [username]);

        if (data.length === 0) {
            return res.status(404).json({ reason: "User not found." });
        }

        return res.status(200).json({ data });
    } catch (e) {
        handleError(e, res);
    }
};

// CHECK validate sort by and order by format
const validSortBy = new Set(["question_id", "starred_at"]);
const validOrderBy = new Set(["asc", "desc"]);

export const getStarredQuestions = async (req: Request, res: Response) => {
    const paramsResult = UserParamsSchema.safeParse(req.params);
    const queryResult = StarredQuestionQuery.safeParse(req.query);

    if (!paramsResult.success || !queryResult.success) {
        return res.status(400).json({ reason: "Invaild params or query" });
    }

    const { userId } = paramsResult.data;
    const { sortBy, limit, page } = queryResult.data;

    const sortByArr = sortBy.split(".");

    if (sortByArr.length != 2) {
        return res.status(400).json({ reason: "Invalid sortBy format." });
    }

    const offset = (page - 1) * limit;

    try {
        const data = await DB().query<UserStarredQuestion>(
            `
            SELECT Q.id, Q.question, LA.was_correct AS last_attempt_correct, LA.answered_at AS last_answered_at
            FROM public.starred_question AS SQ
            INNER JOIN question AS Q
            ON SQ.question_id = Q.id
            LEFT JOIN LATERAL (
                SELECT ah.was_correct, ah.answered_at
                FROM answer_history ah
                WHERE ah.user_id = SQ.user_id
                AND ah.question_id = SQ.question_id
                ORDER BY ah.answered_at DESC
                LIMIT 1
            ) AS LA ON TRUE
            WHERE SQ.user_id = $1
            ORDER BY SQ.${sortByArr[0]} ${sortByArr[1]}
            LIMIT $2
            OFFSET $3;
        `,
            [userId, limit, offset],
        );

        return res.status(200).json({ data });
    } catch (e) {
        handleError(e, res);
    }
};

export const starQuestion = async (req: Request, res: Response) => {
    const result = UserQuestionParamsSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json({ reason: "Invaild question ID" });
    }

    const { questionId, userId } = result.data;

    try {
        await DB().query("INSERT INTO starred_question (user_id, question_id) VALUES ($1, $2);", [userId, questionId]);
        return res.sendStatus(201);
    } catch (e) {
        handleError(e, res);
    }
};

export const unstarQuestion = async (req: Request, res: Response) => {
    const result = UserQuestionParamsSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json({ reason: "Invaild question ID" });
    }

    const { questionId, userId } = result.data;

    try {
        await DB().query("DELETE FROM starred_question WHERE user_id = $1 AND question_id = $2;", [userId, questionId]);
        return res.sendStatus(200);
    } catch (e) {
        handleError(e, res);
    }
};

export const saveAnswerHistory = async (req: Request, res: Response) => {
    const result = UserQuestionParamsSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json({ reason: "Invaild question ID" });
    }

    const { questionId, userId } = result.data;
    const { wasCorrect }: UserHistoryBody = req.body;

    try {
        await DB().query("INSERT INTO answer_history (user_id, question_id, was_correct) VALUES ($1, $2, $3);", [
            userId,
            questionId,
            wasCorrect,
        ]);
        return res.sendStatus(201);
    } catch (e) {
        handleError(e, res);
    }
};
