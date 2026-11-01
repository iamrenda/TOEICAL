import pino from "pino";
import { env } from "./config/env.ts";

const isProduction = env.NODE_ENV === "production";

const logger = pino({
    level: env.LOG_LEVEL,
    ...(isProduction
        ? {}
        : {
              transport: {
                  target: "pino-pretty",
                  options: {
                      colorize: true,
                      translateTime: "SYS:mm-dd-yyyy HH:MM:ss",
                      ignore: "pid,hostname",
                  },
              },
          }),
    redact: {
        paths: [
            "password",
            "*.password",
            "token",
            "*.token",
            "authorization",
            "req.headers.authorization",
        ],
        censor: "[REDACTED]",
    },
});

export default logger;
