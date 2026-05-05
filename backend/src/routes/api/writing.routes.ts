import express from "express";
import validate from "express-zod-safe";
import { getTopics } from "../../controllers/api/writing.controller.ts";
import { getTopicsSchema } from "../../schemas/writing.schema.ts";

// api/writing routes
const router = express.Router();

router.get("/topics", validate({ query: getTopicsSchema }), getTopics);

export default router;
