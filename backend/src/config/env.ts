import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.coerce.number().positive().default(3000),
    DATABASE_URL: z.url(),
    ACCESS_TOKEN_SECRET: z.string().min(32),
    REFRESH_TOKEN_SECRET: z.string().min(32),
    ACCESS_TOKEN_EXPIRATION: z.string().default("1h"),
    REFRESH_TOKEN_EXPIRATION: z.string().default("30d"),
    FASTAPI_URL: z.url(),
});

type EnvSchema = z.infer<typeof envSchema>;

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    throw new Error(`Invalid environment variables: ${z.prettifyError(parsedEnv.error)}`);
}

export const env: EnvSchema = parsedEnv.data;
