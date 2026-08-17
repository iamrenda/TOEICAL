import { z } from "zod";

export const QuestionOverviewListResponseSchema = z.array(
    z.object({
        id: z.number().int(),
        question: z.string(),
        is_starred: z.boolean(),
        was_last_attempt_correct: z.boolean().nullable(),
        last_answered_at: z.date().nullable(),
    }),
);

export const QuestionResponseSchema = z.object({
    id: z.number().int(),
    question: z.string(),
    is_starred: z.boolean(),
    correct_option_id: z.number().int(),
    translated_question: z.string(),
    type_description: z.string(),
    options: z.array(
        z.object({
            option_id: z.number().int(),
            option: z.string(),
            translated_option: z.string().nullable(),
        }),
    ),
    detailed_descriptions: z.array(z.string()),
    translated_vocabs: z.array(z.string()),
});

export const QuestionListResponseSchema = z.array(QuestionResponseSchema);

export const QuestionCountResponseSchema = z.object({
    all: z.number().int(),
    answered: z.number().int(),
    starred: z.number().int(),
    last_answered_wrong: z.number().int(),
});

export type QuestionOverviewListResponse = z.infer<typeof QuestionOverviewListResponseSchema>;
export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;
export type QuestionListResponse = z.infer<typeof QuestionListResponseSchema>;
export type QuestionCountResponse = z.infer<typeof QuestionCountResponseSchema>;
