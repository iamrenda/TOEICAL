import { z } from "zod";

export const WritingResultsParamsSchema = z.object({
    topic: z.string(),
    topicId: z.coerce.number(),
    description: z.string(),
    essay: z.string(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    timeLimit: z.coerce.number(),
    timeTaken: z.coerce.number(),
    wordCount: z.coerce.number(),
});

export const WritingTopicsSchema = z.object({
    difficulty: z.enum(["ALL", "EASY", "MEDIUM", "HARD"]),
    tag: z.enum(["ALL", "daily-life", "reflection", "opinion", "creativity", "social"]),
});
