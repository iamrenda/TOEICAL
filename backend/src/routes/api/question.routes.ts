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
    HistorySaveRequestSchema,
    QuestionIdRequestSchema,
    RandomQuestionRequestSchema,
    OverviewQuestionRequestSchema,
    NextQuestionRequestSchema,
} from "@toeical/shared";
import validate from "express-zod-safe";

// api/question routes
const router = express.Router();

router.get("/overview", validate({ query: OverviewQuestionRequestSchema }), getQuestionOverviews);
router.get("/random", validate({ query: RandomQuestionRequestSchema }), getRandomQuestions);
router.get("/count", getQuestionCount);
router.get("/:questionId", validate({ params: QuestionIdRequestSchema }), getQuestionById);
router.get(
    "/:questionId/next",
    validate({ params: QuestionIdRequestSchema, query: NextQuestionRequestSchema }),
    getNextQuestionById,
);

router.post(
    "/history/:questionId",
    validate({ params: QuestionIdRequestSchema, body: HistorySaveRequestSchema }),
    saveAnswerHistory,
);

router.post("/starred/:questionId", validate({ params: QuestionIdRequestSchema }), starQuestion);
router.delete("/starred/:questionId", validate({ params: QuestionIdRequestSchema }), unstarQuestion);

export default router;
