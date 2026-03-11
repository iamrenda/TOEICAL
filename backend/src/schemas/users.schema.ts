import { z } from "zod";

export const UserIdSchema = z.object({
    userId: z.coerce.number().min(1),
});

export const UsernameSchema = z.object({
    username: z.string().min(1),
});
