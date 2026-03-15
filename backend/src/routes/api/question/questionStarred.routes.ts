import express from "express";
import { starQuestion, unstarQuestion } from "../../../controllers/api/question/questionStarred.controller.ts";

const router = express.Router({ mergeParams: true });

router.post("/:questionId", starQuestion);
router.delete("/:questionId", unstarQuestion);

export default router;
