import express from "express";
import cors from "cors";
import authRouter from "./routes/auth/auth.routes.ts";
import apiRouter from "./routes/api/api.routes.ts";
import dotenv from "dotenv";
import ApiError from "./util/ApiError.ts";
import { setGlobalOptions } from "express-zod-safe";
import { errorHandler } from "./middleware/errorHandler.ts";
import zodValidationErrorHandler from "./middleware/zodValidationErrorHandler.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT!;

app.use(express.json());
app.use(cors());

// zod validation error handler
setGlobalOptions({
    handler: zodValidationErrorHandler,
});

// auth
app.use("/auth", authRouter);

// api
app.use("/api", apiRouter);

// 404 not found
app.use((req, res, next) => {
    throw new ApiError(404, `Route not found (${req.originalUrl})`);
});

// error handling
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));

export default app;
