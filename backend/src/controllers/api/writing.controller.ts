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
            select wt.id, wt.topic, wt.description, wt.limit_time_minutes, wt.recommended_word_count
            from writing_topics as wt
            inner join writing_topic_tags as wtt
            on wt.id = wtt.writing_topic_id
            inner join writing_tags
            on wtt.writing_tag_id = writing_tags.id
            where ($1::text is null or wt.difficulty = $1) and ($2::text is null or writing_tags.tag = $2);
            `,
            [difficulty || null, tag || null],
        );

        return res.json({ status: "success", code: 200, data });
    } catch (e) {
        next(e);
    }
};

export { getTopics };
