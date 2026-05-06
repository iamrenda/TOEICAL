import type { Request, Response, NextFunction } from "express";
import type { ValidatedRequest } from "express-zod-safe";
import type { getTopicsSchema } from "../../schemas/writing.schema.ts";
import DB from "../../db/api.ts";

const getTopics = async (
    req: ValidatedRequest<{ query: typeof getTopicsSchema }>,
    res: Response,
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

        return res.json({ status: "success", code: 200, data });
    } catch (e) {
        next(e);
    }
};

export { getTopics };
