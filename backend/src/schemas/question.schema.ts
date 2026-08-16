import { z } from "zod";

export const QuestionIdSchema = z.object({
    questionId: z.coerce.number().int().min(1),
});

export const OverviewQuestionSchema = z.object({
    sortBy: z.enum(["id.asc", "id.desc", "starred_date.asc", "starred_date.desc"], {
        message: "Invalid sortBy format. Expected format: field.order (e.g. id.asc)",
    }),
    limit: z.coerce.number().int().min(1),
    page: z.coerce.number().int().min(1),
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

export const NextQuestionSchema = OverviewQuestionSchema.pick({ sortBy: true, starred: true });

export const RandomQuestionSchema = z.object({
    type: z.enum(["random", "starred", "unanswered", "wrong"]),
    count: z.coerce.number().int().min(1),
});

export const HistorySaveSchema = z.object({
    wasCorrect: z.boolean(),
});
