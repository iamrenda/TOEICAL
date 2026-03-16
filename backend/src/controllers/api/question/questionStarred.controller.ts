import type { Request, Response } from "express";
import { z } from "zod";
import DB from "../../../db/api.ts";
import handleError from "../../../util/handleError.ts";
import type { ValidatedRequest } from "express-zod-safe";
import type { QuestionIdSchema } from "../../../schemas/question.schema.ts";

export const starQuestion = async (req: ValidatedRequest<{ params: typeof QuestionIdSchema }>, res: Response) => {
    const { questionId } = req.params;
    const { user } = req;

    try {
        await DB().query(
            "INSERT INTO starred_question (user_id, question_id) VALUES ($1, $2) ON CONFLICT (user_id, question_id) DO NOTHING;",
            [user?.id, questionId],
        );
        return res.sendStatus(201);
    } catch (e) {
        handleError(e, res);
    }
};

export const unstarQuestion = async (req: ValidatedRequest<{ params: typeof QuestionIdSchema }>, res: Response) => {
    const { questionId } = req.params;
    const { user } = req;

    try {
        await DB().query("DELETE FROM starred_question WHERE user_id = $1 AND question_id = $2;", [
            user?.id,
            questionId,
        ]);
        return res.sendStatus(200);
    } catch (e) {
        handleError(e, res);
    }
};
