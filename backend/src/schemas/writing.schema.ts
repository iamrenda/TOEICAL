import { z } from "zod";

export const getTopicsSchema = z.object({
    difficulty: z.enum(["ALL", "EASY", "MEDIUM", "HARD"]),
    tag: z.enum(["ALL", "daily-life", "reflection", "opinion", "creativity", "social"]),
});
