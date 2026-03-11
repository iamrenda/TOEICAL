import type { Request, Response } from "express";
import { z } from "zod";
import DB from "../db/api.ts";
import handleError from "../util/handleError.ts";

const QuestionParamsSchema = z.object({
    questionId: z.coerce.number().min(1),
});

export const starQuestion = async (req: Request, res: Response) => {
    const result = QuestionParamsSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json({ reason: "Invaild question ID" });
    }

    const { questionId } = result.data;
    const { userId } = req.body;

    try {
        await DB().query(
            "INSERT INTO starred_question (user_id, question_id) VALUES ($1, $2) ON CONFLICT (user_id, question_id) DO NOTHING;",
            [userId, questionId],
        );
        return res.sendStatus(201);
    } catch (e) {
        handleError(e, res);
    }
};

export const unstarQuestion = async (req: Request, res: Response) => {
    const result = QuestionParamsSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json({ reason: "Invaild question ID" });
    }

    const { questionId } = result.data;
    const { userId } = req.body;

    try {
        await DB().query("DELETE FROM starred_question WHERE user_id = $1 AND question_id = $2;", [userId, questionId]);
        return res.sendStatus(200);
    } catch (e) {
        handleError(e, res);
    }
};
