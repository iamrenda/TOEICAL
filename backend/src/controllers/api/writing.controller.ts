import api from "../../api/api.ts";
import DB from "../../db/db.ts";
import ApiError from "../../util/ApiError.ts";
import type { Response, NextFunction } from "express";
import type { ValidatedRequest } from "express-zod-safe";
import type { WritingTopicRequestSchema, WritingRequestSchema, WritingHistoryRequestSchema } from "@toeical/shared";
import type { ApiSuccessResponse, fastApiSuccessResponse } from "../../types/ApiResponse.ts";
import { ErrorCode } from "../../types/ErrorCode.ts";
import { sendSuccess } from "../../util/apiResponse.ts";
import {
    WritingAiAnalysisResponseSchema,
    WritingResponseSchema,
    WritingTopicListResponseSchema,
    WritingHistoryListResponseSchema,
    type WritingAiAnalysisResponse,
    type WritingResponse,
    type WritingTopicResponse,
    type WritingTopicListResponse,
    type WritingHistoryResponse,
    type WritingHistoryListResponse,
} from "@toeical/shared";

const getWritingAnalysis = async (
    req: ValidatedRequest<{
        body: typeof WritingRequestSchema;
    }>,
    res: Response<ApiSuccessResponse<WritingResponse>>,
    next: NextFunction,
) => {
    const { user } = req;
    const { topic, topicId, description, essay, difficulty, timeLimit, timeTaken, wordCount } = req.body;

    try {
        const writingAnalysis = await api.post<fastApiSuccessResponse<WritingAiAnalysisResponse>>(
            `/ai/writing/analysis`,
            {
                topic,
                description,
                essay,
                difficulty,
                timeLimit,
                timeTaken,
                wordCount,
            },
        );

        const analysisValidationResult = WritingAiAnalysisResponseSchema.safeParse(writingAnalysis.data.data);
        if (!analysisValidationResult.success) {
            throw new ApiError(500, "Invalid response from AI writing analysis.", {
                errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
                zodError: analysisValidationResult.error,
            });
        }

        const {
            structure_score,
            topic_relevancy_score,
            grammar_score,
            vocabulary_score,
            overall_score,
            revised_essay,
            feedback_summary,
        } = analysisValidationResult.data;

        // Saving writing results
        await DB().transaction(async (client) => {
            const rows = await client.query<{ id: string }>(
                `
                INSERT INTO writing_results (structure_score, topic_relevancy_score, grammar_score, vocabulary_score, overall_score, revised_essay, feedback_summary)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id;
            `,
                [
                    structure_score,
                    topic_relevancy_score,
                    grammar_score,
                    vocabulary_score,
                    overall_score,
                    revised_essay,
                    feedback_summary,
                ],
            );

            if (!rows || rows.length === 0) {
                throw new ApiError(500, "Failed to insert into writing_results table.", {
                    errorCode: ErrorCode.DATABASE_ERROR,
                });
            }

            const writingResultId = rows[0]!.id;

            // Saving writing result
            await client.query(
                `
                INSERT INTO users_writing (user_id, writing_topic_id, writing_content, writing_results_id)
                VALUES ($1, $2, $3, $4);
                `,
                [user?.id, topicId, revised_essay, writingResultId],
            );
        });

        const validationResult = WritingResponseSchema.safeParse(writingAnalysis.data.data);
        if (!validationResult.success) {
            throw new ApiError(500, "Invalid response from AI writing analysis", {
                errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
                zodError: validationResult.error,
            });
        }

        return sendSuccess(res, 200, "Writing results saved successfully", validationResult.data);
    } catch (e) {
        next(e);
    }
};

const getTopics = async (
    req: ValidatedRequest<{ query: typeof WritingTopicRequestSchema }>,
    res: Response<ApiSuccessResponse<WritingTopicListResponse>>,
    next: NextFunction,
) => {
    try {
        const { difficulty, tag } = req.query;

        const data = await DB().query<WritingTopicResponse>(
            `
                SELECT 
                    wt.id,
                    wt.topic,
                    wt.description,
                    wt.difficulty,
                    wt.limit_time_minutes,
                    wt.recommended_word_count,
                    ARRAY_AGG(writing_tags.tag) AS tags
                FROM writing_topics AS wt
                INNER JOIN writing_topic_tags AS wtt
                    ON wt.id = wtt.writing_topic_id
                INNER JOIN writing_tags
                    ON wtt.writing_tag_id = writing_tags.id
                WHERE ($1::text is null or wt.difficulty = $1)
                GROUP BY
                    wt.id
                HAVING ($2::text is null or BOOL_OR(writing_tags.tag = $2))
                ORDER BY wt.id ASC;
            `,
            [difficulty === "ALL" ? null : difficulty, tag === "ALL" ? null : tag],
        );

        const validationResult = WritingTopicListResponseSchema.safeParse(data);
        if (!validationResult.success) {
            throw new ApiError(500, "Invalid response from writing topic", {
                errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
                zodError: validationResult.error,
            });
        }

        return sendSuccess(res, 200, "Topics retrieved successfully", validationResult.data);
    } catch (e) {
        next(e);
    }
};

const getHistory = async (
    req: ValidatedRequest<{ query: typeof WritingHistoryRequestSchema }>,
    res: Response<ApiSuccessResponse<WritingHistoryListResponse>>,
    next: NextFunction,
) => {
    const { user } = req;
    const { from, to } = req.query;

    try {
        const data = await DB().query<WritingHistoryResponse>(
            `
            SELECT wt.topic, wt.description, uw.writing_content, wr.*
            FROM users_writing AS uw
            INNER JOIN writing_topics AS wt
            ON uw.writing_topic_id = wt.id
            INNER JOIN writing_results AS wr
            ON uw.writing_results_id = wr.id
            WHERE uw.user_id = $1 AND $2 <= wr.created_at AND wr.created_at <= $3;
        `,
            [user?.id, from, to],
        );

        const validationResult = WritingHistoryListResponseSchema.safeParse(data);
        if (!validationResult.success) {
            throw new ApiError(500, "Invalid response from writing history", {
                errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
                zodError: validationResult.error,
            });
        }

        return sendSuccess(res, 200, "Writing history retrieved successfully", validationResult.data);
    } catch (e) {
        next(e);
    }
};

export { getTopics, getWritingAnalysis, getHistory };
