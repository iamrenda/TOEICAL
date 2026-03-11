import express from "express";
import cors from "cors";
import authRouter from "./routes/auth/auth.routes.ts";
import apiRouter from "./routes/api/api.routes.ts";
import validate, { setGlobalOptions } from "express-zod-safe";
import { UserIdSchema } from "./schemas/users.schema.ts";

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(cors());

// auth
app.use("/auth/users", authRouter);

// api
setGlobalOptions({ missingSchemaBehavior: "any" });
app.use("/api/users/:userId", validate({ params: UserIdSchema }));
app.use("/api/users/:userId", apiRouter);

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
