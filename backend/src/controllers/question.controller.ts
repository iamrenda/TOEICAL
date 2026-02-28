import type { Request, Response } from "express";
import z from "zod";
import DB from "../db/api.ts";
import handleError from "../util/handleError.ts";
import type { Question } from "../types/Question.ts";
import type { UserIdBody } from "../schemas/users.schema.ts";

const RandomQuestionQuerySchema = z.object({
    isStarred: z.stringbool(),
    count: z.coerce.number().min(1),
});

const QuestionParamsSchema = z.object({
    questionId: z.coerce.number().min(1),
});

export const getQuestionById = async (req: Request, res: Response) => {
    const result = QuestionParamsSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json({ reason: "Invaild params" });
    }

    const { questionId } = result.data;

    try {
        const data = await DB().query<Question>("SELECT * FROM question WHERE id = $1", [questionId]);

        if (data.length === 0) {
            return res.status(404).json({ reason: `Question ID: ${questionId} not found` });
        }

        return res.status(200).json({ data: data[0] });
    } catch (e) {
        handleError(e, res);
    }
};

export const getQuestionCount = async (req: Request, res: Response) => {
    const { userId }: UserIdBody = req.body;

    try {
        const allQuestionCount = await DB().query<{
            question_count: string;
        }>("SELECT COUNT(id) AS question_count FROM question");
        const answeredQuestionCount = await DB().query<{ answered_question_count: string }>(
            "SELECT COUNT(DISTINCT question_id) AS answered_question_count FROM answer_history WHERE user_id = $1",
            [userId],
        );
        const starredQuestionCount = await DB().query<{ starred_question_count: string }>(
            "SELECT COUNT(*) AS starred_question_count FROM starred_question WHERE user_id = $1;",
            [userId],
        );

        const data = {
            all: Number(allQuestionCount[0]?.question_count),
            answered: Number(answeredQuestionCount[0]?.answered_question_count),
            starred: Number(starredQuestionCount[0]?.starred_question_count),
        };
        return res.status(200).json({ data });
    } catch (e) {
        handleError(e, res);
    }
};

export const getRandomQuestions = async (req: Request, res: Response) => {
    const result = RandomQuestionQuerySchema.safeParse(req.query);

    if (!result.success) {
        return res.status(400).json({ reason: "Invaild query" });
    }

    const { isStarred, count } = result.data;
    const { userId }: UserIdBody = req.body;

    try {
        const query = isStarred
            ? `
                SELECT Q.id, Q.question, Q.correct_option_id, Q.translated_question, Q.type_description
                FROM starred_question AS SQ
                INNER JOIN question AS Q
                ON SQ.question_id = Q.id
                WHERE user_id = $1
                ORDER BY RANDOM()
                LIMIT $2;
            `
            : `
                SELECT * 
                FROM question 
                ORDER BY RANDOM() 
                LIMIT $1;
            `;

        const queryParameters = isStarred ? [userId, count] : [count];
        const data = await DB().query<Question>(query, queryParameters);

        return res.status(200).json({ data });
    } catch (e) {
        handleError(e, res);
    }
};
