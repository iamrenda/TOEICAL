import express from "express";
import validate from "express-zod-safe";
import { getHistory, getTopics, getWritingAnalysis } from "../../controllers/api/writing.controller.ts";
import {
    WritingHistoryRequestSchema,
    WritingResultsRequestSchema,
    WritingTopicListSchema,
} from "../../schemas/writing.schema.ts";

// api/writing routes
const router = express.Router();

router.post("/", validate({ body: WritingResultsRequestSchema }), getWritingAnalysis);
router.get("/topics", validate({ query: WritingTopicListSchema }), getTopics);
router.get("/history", validate({ query: WritingHistoryRequestSchema }), getHistory);

export default router;
