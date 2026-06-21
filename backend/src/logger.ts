import pino from "pino";

const logger = pino({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:mm-dd-yyyy HH:MM:ss",
            ignore: "pid,hostname",
        },
    },
});

export default logger;
