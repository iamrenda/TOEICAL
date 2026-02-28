import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.routes.ts";
import questionRouter from "./routes/question.routes.ts";

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use("/api/users", usersRouter);
app.use("/api/question", questionRouter);

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
