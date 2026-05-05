import { z } from "zod";

export const getTopicsSchema = z.object({
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
    tag: z.enum(["daily-life", "reflection", "opinion", "creativity", "social"]).optional(),
});
