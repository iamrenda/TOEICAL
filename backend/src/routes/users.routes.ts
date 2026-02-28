import express from "express";
import {
    createUser,
    getStarredQuestions,
    getUser,
    saveAnswerHistory,
    starQuestion,
    unstarQuestion,
} from "../controllers/users.controller.ts";
import vaildate from "../middleware/validate.ts";
import { createUserHistorySchema, createUsernameSchema } from "../schemas/users.schema.ts";

// /api/users
const router = express.Router();

router.post("/", vaildate(createUsernameSchema), createUser);
router.get("/:username", getUser);
router.get("/:userId/starred", getStarredQuestions);
router.post("/:userId/starred/:questionId", starQuestion);
router.delete("/:userId/starred/:questionId", unstarQuestion);
router.post("/:userId/history/:questionId", vaildate(createUserHistorySchema), saveAnswerHistory);

export default router;
