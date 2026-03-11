import express from "express";
import { starQuestion, unstarQuestion } from "../../../controllers/questionStarred.controller.ts";

const router = express.Router();

router.post("/:questionId", starQuestion);
router.delete("/:questionId", unstarQuestion);

export default router;
