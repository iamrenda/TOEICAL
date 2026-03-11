import express from "express";
import { createUser, getUser } from "../../controllers/auth.controller.ts";
import validate from "express-zod-safe";
import { UsernameSchema } from "../../schemas/users.schema.ts";

// /auth/users
const router = express.Router();

router.post("/", validate({ body: UsernameSchema }), createUser);
router.get("/:username", validate({ params: UsernameSchema }), getUser);

export default router;
