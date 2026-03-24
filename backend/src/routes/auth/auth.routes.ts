import express from "express";
import { userLogin, userSignup, fetchAccessToken } from "../../controllers/auth/auth.controller.ts";

// /auth/users
const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/token", fetchAccessToken);

export default router;
