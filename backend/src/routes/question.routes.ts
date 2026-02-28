import express from "express";
import { getQuestionById } from "../controllers/question.controller.ts";

// /api/question
const router = express.Router();

router.get("/:questionId", getQuestionById);

export default router;
