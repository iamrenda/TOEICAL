import express from "express";
import { getQuestionById, getQuestionCount, getRandomQuestions } from "../controllers/question.controller.ts";
import vaildate from "../middleware/validate.ts";
import { createUserIdSchema } from "../schemas/users.schema.ts";

// /api/question
const router = express.Router();

router.get("/count", vaildate(createUserIdSchema), getQuestionCount);
router.get("/random", vaildate(createUserIdSchema), getRandomQuestions);
router.get("/:questionId", getQuestionById);

export default router;
