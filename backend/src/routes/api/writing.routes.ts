import express from "express";
import validate from "express-zod-safe";
import { getHistory, getTopics, getWritingAnalysis } from "../../controllers/api/writing.controller.ts";
import { WritingRequestSchema, WritingTopicRequestSchema, WritingHistoryRequestSchema } from "@toeical/shared";

// api/writing routes
const router = express.Router();

router.post("/", validate({ body: WritingRequestSchema }), getWritingAnalysis);
router.get("/topics", validate({ query: WritingTopicRequestSchema }), getTopics);
router.get("/history", validate({ query: WritingHistoryRequestSchema }), getHistory);

export default router;
