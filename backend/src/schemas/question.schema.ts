import { z } from "zod";

export const QuestionIdSchema = z.object({
    questionId: z.coerce.number().min(1),
});

export const StarredQuestionSchema = z.object({
    sortBy: z.string(),
    limit: z.coerce.number(),
    page: z.coerce.number().min(1),
    starred: z.string().transform((val, ctx) => {
        if (val.toLowerCase() === "true") return true;
        if (val.toLowerCase() === "false") return false;
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "starred must be 'true' or 'false'",
        });

        return z.NEVER;
    }),
});

export const RandomQuestionSchema = z.object({
    isStarred: z.stringbool(),
    count: z.coerce.number().min(1),
});

export const HistorySaveSchema = z.object({
    wasCorrect: z.boolean(),
});
