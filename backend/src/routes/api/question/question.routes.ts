import express from "express";
import {
    getQuestionById,
    getQuestionCount,
    getQuestionOverviews,
    getRandomQuestions,
    saveAnswerHistory,
} from "../../../controllers/api/question/question.controller.ts";
import {
    HistorySaveSchema,
    QuestionIdSchema,
    RandomQuestionSchema,
    StarredQuestionSchema,
} from "../../../schemas/question.schema.ts";
import validate from "express-zod-safe";

const router = express.Router();

router.get("/overview", validate({ query: StarredQuestionSchema }), getQuestionOverviews);
router.get("/random", validate({ query: RandomQuestionSchema }), getRandomQuestions);
router.get("/count", getQuestionCount);
router.post("/history/:questionId", validate({ params: QuestionIdSchema, body: HistorySaveSchema }), saveAnswerHistory);
router.get("/:questionId", validate({ params: QuestionIdSchema }), getQuestionById);

export default router;
