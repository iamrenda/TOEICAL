import { z } from "zod";

export const createUsernameSchema = z.object({
    username: z.string().min(1),
});

export const createUserIdSchema = z.object({
    userId: z.number().min(1),
});

export const createUserHistorySchema = z.object({
    wasCorrect: z.boolean(),
});

export type UsernameBody = z.infer<typeof createUsernameSchema>;

export type UserHistoryBody = z.infer<typeof createUserHistorySchema>;

export type UserIdBody = z.infer<typeof createUserIdSchema>;
