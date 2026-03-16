import express from "express";
import questionRouter from "./question/question.routes.ts";
import starredQuestionRouter from "./question/questionStarred.routes.ts";
import authenticateToken from "../../middleware/authenticateToken.ts";

const router = express.Router();

router.use(authenticateToken);
router.use("/question", questionRouter);
router.use("/question/starred", starredQuestionRouter);

export default router;
