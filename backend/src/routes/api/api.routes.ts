import express from "express";
import questionRouter from "./question/question.routes.ts";
import questionStarredRouter from "./question/questionStarred.routes.ts";
import authenticateToken from "../../middleware/authenticateToken.ts";

const router = express.Router();

router.use(authenticateToken);
router.use("/users/:userId/question", questionRouter);
router.use("/users/:userId/starred", questionStarredRouter);

export default router;
