import type { Request, Response } from "express";
import z from "zod";
import DB from "../db/api.ts";
import handleError from "../util/handleError.ts";
import type { Question } from "../types/Question.ts";

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
