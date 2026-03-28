import express from "express";
import {
    getNextQuestionById,
    getQuestionById,
    getQuestionCount,
    getQuestionOverviews,
    getRandomQuestions,
    saveAnswerHistory,
    starQuestion,
    unstarQuestion,
} from "../../controllers/api/question.controller.ts";
import {
    HistorySaveSchema,
    QuestionIdSchema,
    RandomQuestionSchema,
    OverviewQuestionSchema,
    NextQuestionSchema,
} from "../../schemas/question.schema.ts";
import validate from "express-zod-safe";

// api/question routes
const router = express.Router();

router.get("/overview", validate({ query: OverviewQuestionSchema }), getQuestionOverviews);
router.get("/random", validate({ query: RandomQuestionSchema }), getRandomQuestions);
router.get("/count", getQuestionCount);
router.get("/:questionId", validate({ params: QuestionIdSchema }), getQuestionById);
router.get("/:questionId/next", validate({ params: QuestionIdSchema, query: NextQuestionSchema }), getNextQuestionById);

router.post("/history/:questionId", validate({ params: QuestionIdSchema, body: HistorySaveSchema }), saveAnswerHistory);

router.post("/starred/:questionId", starQuestion);
router.delete("/starred/:questionId", unstarQuestion);

export default router;
