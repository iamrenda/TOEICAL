import api from "../../api/api.ts";
import DB from "../../db/db.ts";
import type { Response, NextFunction } from "express";
import type { AIWritingResult } from "../../types/Writing.ts";
import type { ValidatedRequest } from "express-zod-safe";
import type {
    WritingTopicsSchema,
    WritingResultsParamsSchema,
    WritingHistorySchema,
} from "../../schemas/writing.schema.ts";
import type { ApiResponse } from "../../types/ApiResponse.ts";
import ApiError from "../../util/ApiError.ts";
import type { AxiosResponse } from "../../types/Axios.ts";

const getWritingAnalysis = async (
    req: ValidatedRequest<{
        body: typeof WritingResultsParamsSchema;
    }>,
    res: Response<ApiResponse<AIWritingResult>>,
    next: NextFunction,
) => {
    const { user } = req;
    const { topic, topicId, description, essay, difficulty, timeLimit, timeTaken, wordCount } = req.body;

    try {
        // AI analysis
        const writingAnalysis = await api.post<AxiosResponse<AIWritingResult>>(`/ai/writing/analysis`, {
            topic,
            description,
            essay,
            difficulty,
            timeLimit,
            timeTaken,
            wordCount,
        });

        if (writingAnalysis.data.status !== "success") {
            throw new ApiError(500, "Failed to get writing analysis from AI.");
        }

        const {
            structure_score,
            topic_relevancy_score,
            grammar_score,
            vocabulary_score,
            overall_score,
            revised_essay,
            feedback_summary,
        } = writingAnalysis.data.data;

        await DB().transaction(async (client) => {
            // Saving writing results
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
                throw new ApiError(500, "Failed to insert into writing_results table.");
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

        return res.status(200).json({
            status: "success",
            message: "Writing results saved successfully",
            error: null,
            data: writingAnalysis.data.data,
        });
    } catch (e) {
        next(e);
    }
};

const getTopics = async (
    req: ValidatedRequest<{ query: typeof WritingTopicsSchema }>,
    res: Response<ApiResponse<any>>,
    next: NextFunction,
) => {
    try {
        const { difficulty, tag } = req.query;

        const data = await DB().query(
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
                AND ($2::text is null or writing_tags.tag = $2)
                GROUP BY 
                    wt.id
                ORDER BY wt.id ASC;
            `,
            [difficulty === "ALL" ? null : difficulty, tag === "ALL" ? null : tag],
        );

        return res.status(200).json({ status: "success", data, message: "Topics retrieved successfully", error: null });
    } catch (e) {
        next(e);
    }
};

const getHistory = async (
    req: ValidatedRequest<{ query: typeof WritingHistorySchema }>,
    res: Response<ApiResponse<any>>,
    next: NextFunction,
) => {
    const { user } = req;
    const { from, to } = req.query;

    try {
        const data = await DB().query(
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
        return res
            .status(200)
            .json({ status: "success", data, message: "Writing history retrieved successfully", error: null });
    } catch (e) {
        next(e);
    }
};

export { getTopics, getWritingAnalysis, getHistory };
