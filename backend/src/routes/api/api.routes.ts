import express from "express";
import questionRouter from "./question.routes.ts";
import writingRouter from "./writing.routes.ts";
import authenticateToken from "../../middleware/authenticateToken.ts";

const router = express.Router();

router.use(authenticateToken);
router.use("/question", questionRouter);
router.use("/writing", writingRouter);

export default router;
