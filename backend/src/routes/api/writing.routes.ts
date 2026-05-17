import express from "express";
import validate from "express-zod-safe";
import { getTopics, getWritingAnalysis } from "../../controllers/api/writing.controller.ts";
import {
    getTopicsSchema,
    getWritingResultsParamsSchema,
    getWritingResultsParamsBodySchema,
} from "../../schemas/writing.schema.ts";

// api/writing routes
const router = express.Router();

router.post(
    "/:userId",
    validate({ params: getWritingResultsParamsSchema, body: getWritingResultsParamsBodySchema }),
    getWritingAnalysis,
);
router.get("/topics", validate({ query: getTopicsSchema }), getTopics);

export default router;
