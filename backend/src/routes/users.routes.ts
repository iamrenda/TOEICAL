import express from "express";
import {
    createUser,
    getQuestionCount,
    getStarredQuestions,
    getUser,
    saveAnswerHistory,
    starQuestion,
    unstarQuestion,
} from "../controllers/users.controller.ts";
import vaildate from "../middleware/validate.ts";
import { createHistorySchema, createUserSchema } from "../schemas/users.schema.ts";

// /api/users
const router = express.Router();

router.post("/", vaildate(createUserSchema), createUser);
router.get("/:username", getUser);
router.get("/:userId/starred", getStarredQuestions);
router.post("/:userId/starred/:questionId", starQuestion);
router.delete("/:userId/starred/:questionId", unstarQuestion);
router.post("/:userId/history/:questionId", vaildate(createHistorySchema), saveAnswerHistory);
router.get("/:userId/count", getQuestionCount);

export default router;
