import { z } from "zod";

export const createUserSchema = z.object({
    username: z.string().min(1),
});

export const createHistorySchema = z.object({
    wasCorrect: z.boolean(),
});

export type UserBody = z.infer<typeof createUserSchema>;

export type UserHistoryBody = z.infer<typeof createHistorySchema>;
