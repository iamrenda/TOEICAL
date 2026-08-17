import type { NextFunction, Request, Response } from "express";
import DB from "../../db/db.ts";
import {
    HistorySaveRequestSchema,
    QuestionIdRequestSchema,
    RandomQuestionRequestSchema,
    OverviewQuestionRequestSchema,
    NextQuestionRequestSchema,
    QuestionOverviewListResponseSchema,
    QuestionResponseSchema,
    QuestionListResponseSchema,
    QuestionCountResponseSchema,
    type QuestionOverviewListResponse,
    type QuestionResponse,
    type QuestionListResponse,
    type QuestionCountResponse,
} from "@toeical/shared";
import type { ValidatedRequest } from "express-zod-safe";
import type { z } from "zod";
import ApiError from "../../util/ApiError.ts";
import type { ApiSuccessResponse } from "../../types/ApiResponse.ts";
import { sendSuccess } from "../../util/apiResponse.ts";
import { ErrorCode } from "../../types/ErrorCode.ts";

type SortBy = z.infer<typeof OverviewQuestionRequestSchema>["sortBy"];

const SORT_ORDER_BY: Record<SortBy, string> = {
    "id.asc": "q.id ASC",
    "id.desc": "q.id DESC",
    "starred_date.asc": "sq.created_at ASC NULLS LAST, q.id ASC",
    "starred_date.desc": "sq.created_at DESC NULLS LAST, q.id DESC",
};

const SORT_AFTER_CURRENT: Record<SortBy, string> = {
    "id.asc": "q.id > c.id",
    "id.desc": "q.id < c.id",
    "starred_date.asc": `(
        (c.created_at IS NOT NULL AND (
            (sq.created_at IS NOT NULL AND (sq.created_at, q.id) > (c.created_at, c.id))
            OR sq.created_at IS NULL
        ))
        OR (c.created_at IS NULL AND sq.created_at IS NULL AND q.id > c.id)
    )`,
    "starred_date.desc": `(
        (c.created_at IS NOT NULL AND (
            (sq.created_at IS NOT NULL AND (sq.created_at, q.id) < (c.created_at, c.id))
            OR sq.created_at IS NULL
        ))
        OR (c.created_at IS NULL AND sq.created_at IS NULL AND q.id < c.id)
    )`,
};

const getQuestionDataById = async (questionId: number, userId?: number) => {
    try {
        const data = await DB().query<QuestionResponse>(
            `
                SELECT
                    q.*,
                    EXISTS(SELECT 1 FROM starred_question WHERE question_id = $1 AND user_id = $2) AS is_starred,
                    COALESCE(
                        json_agg(DISTINCT jsonb_build_object('option_id', o.id, 'option', o.option, 'translated_option', o.translated_option))
                            FILTER (WHERE o.id IS NOT NULL),
                        '[]'
                    ) AS options,
                    COALESCE(
                        json_agg(DISTINCT dd.description) FILTER (WHERE dd.description IS NOT NULL),
                        '[]'
                    ) AS detailed_descriptions,
                    COALESCE(
                        json_agg(DISTINCT tv.translated_options_text) FILTER (WHERE tv.translated_options_text IS NOT NULL),
                        '[]'
                    ) AS translated_vocabs
                FROM question AS q
                LEFT JOIN option AS o ON q.id = o.question_id
                LEFT JOIN detailed_description AS dd ON q.id = dd.question_id
                LEFT JOIN translated_vocab AS tv ON q.id = tv.question_id
                WHERE q.id = $3
                GROUP BY q.id;
                `,
            [questionId, userId, questionId],
        );

        return data;
    } catch (e) {
        throw e;
    }
};

export const getQuestionOverviews = async (
    req: ValidatedRequest<{ query: typeof OverviewQuestionRequestSchema }>,
    res: Response<ApiSuccessResponse<QuestionOverviewListResponse>>,
    next: NextFunction,
) => {
    try {
        const { user } = req;
        const { sortBy, limit, page, starred } = req.query;

        const offset = (page - 1) * limit;

        const query = starred
            ? `
            SELECT
                q.id,
                q.question,
                TRUE AS is_starred,
                la.was_correct AS was_last_attempt_correct,
                la.answered_at AS last_answered_at
            FROM starred_question sq
            JOIN question q
                ON q.id = sq.question_id
                AND sq.user_id = $1
            LEFT JOIN LATERAL (
                SELECT ah.was_correct, ah.answered_at
                FROM answer_history ah
                WHERE ah.user_id = $1
                AND ah.question_id = q.id
                ORDER BY ah.answered_at DESC
                LIMIT 1
            ) la ON TRUE
            ORDER BY ${SORT_ORDER_BY[sortBy]}
            LIMIT $2 OFFSET $3;
    `
            : `
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
            ORDER BY ${SORT_ORDER_BY[sortBy]}
            LIMIT $2 OFFSET $3;
    `;

        const data = await DB().query<QuestionOverviewListResponse>(query, [user?.id, limit, offset]);

        const validationResult = QuestionOverviewListResponseSchema.safeParse(data);
        if (!validationResult.success) {
            throw new ApiError(500, "Response validation failed for question overviews", {
                errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
                zodError: validationResult.error.issues,
            });
        }

        return sendSuccess(res, 200, "Question overviews retrieved successfully", validationResult.data);
    } catch (e) {
        next(e);
    }
};

export const getRandomQuestions = async (
    req: ValidatedRequest<{ query: typeof RandomQuestionRequestSchema }>,
    res: Response<ApiSuccessResponse<QuestionListResponse>>,
    next: NextFunction,
) => {
    try {
        const { user } = req;
        const { type, count } = req.query;

        let condition = "";

        if (type === "starred") {
            condition = `
                WHERE q.id IN (
                    SELECT question_id
                    FROM starred_question
                    WHERE user_id = $1
                    ORDER BY RANDOM()
                    LIMIT $2
                )
            `;
        } else if (type === "unanswered") {
            condition = `
                WHERE q.id IN (
                    SELECT id
                    FROM question
                    WHERE id NOT IN (
                        SELECT question_id
                        FROM answer_history
                        WHERE user_id = $1
                    )
                    ORDER BY RANDOM()
                    LIMIT $2
                )
            `;
        } else if (type === "wrong") {
            condition = `
                WHERE q.id IN (
                    SELECT t.question_id
                    FROM (
                        SELECT question_id, was_correct,
                               ROW_NUMBER() OVER (PARTITION BY question_id ORDER BY answered_at DESC) as rn
                        FROM answer_history
                        WHERE user_id = $1
                    ) t
                    WHERE t.rn = 1 AND t.was_correct = false
                    ORDER BY RANDOM()
                    LIMIT $2
                )
            `;
        } else {
            // random
            condition = `
                WHERE q.id IN (
                    SELECT id
                    FROM question
                    ORDER BY RANDOM()
                    LIMIT $2
                )
            `;
        }

        const query = `
            SELECT
                q.*,
                EXISTS (
                    SELECT 1
                    FROM starred_question sq
                    WHERE sq.question_id = q.id
                    AND sq.user_id = $1
                ) AS is_starred,
                COALESCE(
                    json_agg(DISTINCT jsonb_build_object(
                        'option_id', o.id,
                        'option', o.option,
                        'translated_option', o.translated_option
                    )) FILTER (WHERE o.id IS NOT NULL),
                    '[]'
                ) AS options,
                COALESCE(
                    json_agg(DISTINCT dd.description) FILTER (WHERE dd.description IS NOT NULL),
                    '[]'
                ) AS detailed_descriptions,
                COALESCE(
                    json_agg(DISTINCT tv.translated_options_text) FILTER (WHERE tv.translated_options_text IS NOT NULL),
                    '[]'
                ) AS translated_vocabs
            FROM question AS q
            LEFT JOIN option AS o ON q.id = o.question_id
            LEFT JOIN detailed_description AS dd ON q.id = dd.question_id
            LEFT JOIN translated_vocab AS tv ON q.id = tv.question_id
            ${condition}
            GROUP BY q.id;
        `;

        const queryParameters = [user?.id, count];
        const data = await DB().query<QuestionListResponse>(query, queryParameters);

        const validationResult = QuestionListResponseSchema.safeParse(data);
        if (!validationResult.success) {
            throw new ApiError(500, "Response validation failed for random questions", {
                errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
                zodError: validationResult.error.issues,
            });
        }

        return sendSuccess(res, 200, "Random questions retrieved successfully", validationResult.data);
    } catch (e) {
        next(e);
    }
};

export const getQuestionCount = async (
    req: Request,
    res: Response<ApiSuccessResponse<QuestionCountResponse>>,
    next: NextFunction,
) => {
    try {
        const { user } = req;

        const allQuestionCount = await DB().query<{
            question_count: string;
        }>("SELECT COUNT(id) AS question_count FROM question");
        const answeredQuestionCount = await DB().query<{ answered_question_count: string }>(
            "SELECT COUNT(DISTINCT question_id) AS answered_question_count FROM answer_history WHERE user_id = $1",
            [user?.id],
        );
        const lastWrongAttemptCount = await DB().query<{ last_attempt_count: string }>(
            `
            SELECT COUNT(*) AS last_attempt_count
            FROM (
                SELECT 
                    question_id,
                    was_correct,
                    ROW_NUMBER() OVER (
                        PARTITION BY question_id 
                        ORDER BY answered_at DESC
                    ) AS rn
                FROM answer_history
                WHERE user_id = $1
            ) t
            WHERE rn = 1
                AND was_correct = false;
            `,
            [user?.id],
        );
        const starredQuestionCount = await DB().query<{ starred_question_count: string }>(
            "SELECT COUNT(*) AS starred_question_count FROM starred_question WHERE user_id = $1;",
            [user?.id],
        );

        const data = {
            all: Number(allQuestionCount[0]?.question_count),
            answered: Number(answeredQuestionCount[0]?.answered_question_count),
            starred: Number(starredQuestionCount[0]?.starred_question_count),
            last_answered_wrong: Number(lastWrongAttemptCount[0]?.last_attempt_count),
        };

        const validationResult = QuestionCountResponseSchema.safeParse(data);
        if (!validationResult.success) {
            throw new ApiError(500, "Response validation failed for question count", {
                errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
                zodError: validationResult.error.issues,
            });
        }

        return sendSuccess(res, 200, "Question count retrieved successfully", validationResult.data);
    } catch (e) {
        next(e);
    }
};

export const saveAnswerHistory = async (
    req: ValidatedRequest<{
        body: typeof HistorySaveRequestSchema;
        params: typeof QuestionIdRequestSchema;
    }>,
    res: Response<ApiSuccessResponse<null>>,
    next: NextFunction,
) => {
    try {
        const { user } = req;
        const { questionId } = req.params;
        const { wasCorrect } = req.body;

        // check if question exists
        await DB()
            .query("SELECT id FROM question WHERE id = $1;", [questionId])
            .then((result) => {
                if (result.length === 0) {
                    throw new ApiError(404, `Question ID: ${questionId} not found`, {
                        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
                    });
                }
            });

        await DB().query("INSERT INTO answer_history (user_id, question_id, was_correct) VALUES ($1, $2, $3);", [
            user?.id,
            questionId,
            wasCorrect,
        ]);

        return sendSuccess(res, 201, "Answer history saved successfully", null);
    } catch (e) {
        next(e);
    }
};

export const getQuestionById = async (
    req: ValidatedRequest<{ params: typeof QuestionIdRequestSchema }>,
    res: Response<ApiSuccessResponse<QuestionResponse>>,
    next: NextFunction,
) => {
    try {
        const { user } = req;
        const { questionId } = req.params;

        const data = await getQuestionDataById(questionId, user?.id);

        if (!data || data.length === 0) {
            throw new ApiError(404, `Question ID: ${questionId} not found`, {
                errorCode: ErrorCode.RESOURCE_NOT_FOUND,
            });
        }

        const validationResult = QuestionResponseSchema.safeParse(data[0]);
        if (!validationResult.success) {
            throw new ApiError(500, "Response validation failed for question by ID", {
                errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
                zodError: validationResult.error.issues,
            });
        }

        return sendSuccess(res, 200, "Question retrieved successfully", validationResult.data);
    } catch (e) {
        next(e);
    }
};

export const getNextQuestionById = async (
    req: ValidatedRequest<{ params: typeof QuestionIdRequestSchema; query: typeof NextQuestionRequestSchema }>,
    res: Response<ApiSuccessResponse<QuestionResponse>>,
    next: NextFunction,
) => {
    try {
        const { user } = req;
        const { questionId } = req.params;
        const { sortBy, starred } = req.query;

        const nextQuestion = await DB().query<{ id: number }>(
            `
            WITH current AS (
                SELECT q.id, sq.created_at
                FROM question q
                LEFT JOIN starred_question sq
                    ON sq.question_id = q.id
                    AND sq.user_id = $1
                WHERE q.id = $2
            )
            SELECT q.id
            FROM question q
            LEFT JOIN starred_question sq
                ON sq.question_id = q.id
                AND sq.user_id = $1
            CROSS JOIN current c
            WHERE ${starred ? "sq.question_id IS NOT NULL" : "TRUE"}
            AND ${SORT_AFTER_CURRENT[sortBy]}
            ORDER BY ${SORT_ORDER_BY[sortBy]}
            LIMIT 1;
            `,
            [user?.id, questionId],
        );

        if (nextQuestion.length === 0) {
            throw new ApiError(404, starred ? "No next starred question found" : "No next question found", {
                errorCode: ErrorCode.RESOURCE_NOT_FOUND,
            });
        }

        const nextQuestionId = nextQuestion[0]!.id;
        const data = await getQuestionDataById(nextQuestionId, user?.id);

        if (data.length === 0) {
            throw new ApiError(404, `Question ID: ${nextQuestionId} not found`, {
                errorCode: ErrorCode.RESOURCE_NOT_FOUND,
            });
        }

        const validationResult = QuestionResponseSchema.safeParse(data[0]);
        if (!validationResult.success) {
            throw new ApiError(500, "Response validation failed for next question", {
                errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
                zodError: validationResult.error.issues,
            });
        }

        return sendSuccess(res, 200, "Next question retrieved successfully", validationResult.data);
    } catch (e) {
        next(e);
    }
};

export const starQuestion = async (
    req: ValidatedRequest<{ params: typeof QuestionIdRequestSchema }>,
    res: Response<ApiSuccessResponse<null>>,
    next: NextFunction,
) => {
    try {
        const { questionId } = req.params;
        const { user } = req;

        // check if question exists
        await DB()
            .query("SELECT id FROM question WHERE id = $1;", [questionId])
            .then((result) => {
                if (result.length === 0) {
                    throw new ApiError(404, `Question ID: ${questionId} not found`, {
                        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
                    });
                }
            });

        await DB().query(
            "INSERT INTO starred_question (user_id, question_id) VALUES ($1, $2) ON CONFLICT (user_id, question_id) DO NOTHING;",
            [user?.id, questionId],
        );

        return sendSuccess(res, 201, "Question starred successfully", null);
    } catch (e) {
        next(e);
    }
};

export const unstarQuestion = async (
    req: ValidatedRequest<{ params: typeof QuestionIdRequestSchema }>,
    res: Response<ApiSuccessResponse<null>>,
    next: NextFunction,
) => {
    try {
        const { questionId } = req.params;
        const { user } = req;

        // check if question exists
        await DB()
            .query("SELECT id FROM question WHERE id = $1;", [questionId])
            .then((result) => {
                if (result.length === 0) {
                    throw new ApiError(404, `Question ID: ${questionId} not found`, {
                        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
                    });
                }
            });

        await DB().query("DELETE FROM starred_question WHERE user_id = $1 AND question_id = $2;", [
            user?.id,
            questionId,
        ]);

        return sendSuccess(res, 200, "Question unstarred successfully", null);
    } catch (e) {
        next(e);
    }
};
