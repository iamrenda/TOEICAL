import express from "express";
import questionRouter from "./question/question.routes.ts";
import questionStarredRouter from "./question/questionStarred.routes.ts";

const router = express.Router();

router.use("/question", questionRouter);
router.use("/question/starred", questionStarredRouter);

export default router;
