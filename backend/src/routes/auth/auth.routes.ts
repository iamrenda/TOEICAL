import express from "express";
import { userLogin, userSignin, fetchAccessToken } from "../../controllers/auth/auth.controller.ts";

// /auth/users
const router = express.Router();

router.post("/signin", userSignin);
router.post("/login", userLogin);
router.get("/token", fetchAccessToken);

export default router;
