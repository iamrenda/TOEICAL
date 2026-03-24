import { z } from "zod";

export const UserSignupSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.email(),
});

export const UserLoginSchema = z.object({
    email: z.email(),
    password: z.string(),
});

export const UserTokenSchema = z.object({
    token: z.string(),
});
