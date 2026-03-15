import type { Response } from "express";
import DB from "../../../db/api.ts";
import handleError from "../../../util/handleError.ts";
import type { Question } from "../../../types/Question.ts";
import {
    HistorySaveSchema,
    QuestionIdSchema,
    RandomQuestionSchema,
    StarredQuestionSchema,
} from "../../../schemas/question.schema.ts";
import type { ValidatedRequest } from "express-zod-safe";
import type { UserIdSchema } from "../../../schemas/users.schema.ts";

type QuestionOverview = {
    id: number;
    question: string;
    last_attempt_correct: boolean;
    last_answered_at: string;
};

// CHECK validate sort by and order by format
const validSortBy = new Set(["id"]);
const validOrderBy = new Set(["asc", "desc"]);

export const getQuestionOverviews = async (
    req: ValidatedRequest<{ query: typeof StarredQuestionSchema; params: typeof UserIdSchema }>,
    res: Response,
) => {
    const { userId } = req.params;
    const { sortBy, limit, page } = req.query;

    const sortByArr = sortBy.split(".");

    if (sortByArr.length != 2) {
        return res.status(400).json({ reason: "Invalid sortBy format." });
    }

    const offset = (page - 1) * limit;

    try {
        const data = await DB().query<QuestionOverview>(
            `
           SELECT 
                q.id,
                q.question,
                CASE WHEN sq.question_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_starred,
                la.was_correct AS was_last_attempt_correct,
                la.answered_at AS last_answered_at
            FROM question q
            LEFT JOIN starred_question AS sq
                ON sq.question_id = q.id
                AND sq.user_id = $1
            LEFT JOIN LATERAL (
                SELECT ah.was_correct, ah.answered_at
                FROM answer_history ah
                WHERE ah.user_id = $1
                AND ah.question_id = q.id
                ORDER BY ah.answered_at DESC
                LIMIT 1
            ) la ON TRUE
            ORDER BY q.${sortByArr[0]} ${sortByArr[1]}	
            LIMIT $2 OFFSET $3;
        `,
            [userId, limit, offset],
        );

        return res.status(200).json({ data });
    } catch (e) {
        handleError(e, res);
    }
};

export const getRandomQuestions = async (
    req: ValidatedRequest<{ query: typeof RandomQuestionSchema; body: typeof UserIdSchema }>,
    res: Response,
) => {
    const { userId } = req.body;
    const { isStarred, count } = req.query;

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

export const getQuestionCount = async (req: ValidatedRequest<{ body: typeof UserIdSchema }>, res: Response) => {
    const { userId } = req.body;

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

export const saveAnswerHistory = async (
    req: ValidatedRequest<{
        body: typeof UserIdSchema & typeof HistorySaveSchema;
        params: typeof QuestionIdSchema;
    }>,
    res: Response,
) => {
    const { questionId } = req.params;
    const { userId, wasCorrect } = req.body;

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

export const getQuestionById = async (
    req: ValidatedRequest<{ params: typeof QuestionIdSchema & typeof UserIdSchema }>,
    res: Response,
) => {
    const { questionId, userId } = req.params;

    try {
        const data = await DB().query<Question>(
            `
            SELECT
                q.*,
                EXISTS(SELECT 1 FROM starred_question WHERE question_id = $1 AND user_id = $2) AS is_starred,
                json_agg(DISTINCT jsonb_build_object('option_id', o.id, 'option', o.option, 'translated_option', o.translated_option)) AS options,
                json_agg(DISTINCT dd.description) AS detailed_descriptions,
                json_agg(DISTINCT tv.translated_options_text) AS translated_vocabs
            FROM question AS q
            LEFT JOIN option AS o ON q.id = o.question_id
            LEFT JOIN detailed_description AS dd ON q.id = dd.question_id
            LEFT JOIN translated_vocab AS tv ON q.id = tv.question_id
            WHERE q.id = $3
            GROUP BY q.id;
            `,
            [questionId, userId, questionId],
        );

        if (data.length === 0) {
            return res.status(404).json({ reason: `Question ID: ${questionId} not found` });
        }

        return res.status(200).json({ data: data[0] });
    } catch (e) {
        handleError(e, res);
    }
};
