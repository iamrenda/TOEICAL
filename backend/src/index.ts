import express from "express";
import cors from "cors";
import authRouter from "./routes/auth/auth.routes.ts";
import apiRouter from "./routes/api/api.routes.ts";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT!;

app.use(express.json());
app.use(cors());

// auth
app.use("/auth", authRouter);

// api
app.use("/api", apiRouter);

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
