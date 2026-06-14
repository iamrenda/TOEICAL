import express from "express";
import validate from "express-zod-safe";
import { getHistory, getTopics, getWritingAnalysis } from "../../controllers/api/writing.controller.ts";
import { WritingHistorySchema, WritingResultsParamsSchema, WritingTopicsSchema } from "../../schemas/writing.schema.ts";

// api/writing routes
const router = express.Router();

router.post("/", validate({ body: WritingResultsParamsSchema }), getWritingAnalysis);
router.get("/topics", validate({ query: WritingTopicsSchema }), getTopics);
router.get("/history", validate({ query: WritingHistorySchema }), getHistory);

export default router;
