import express from "express";
import { userLogin, userSignup, fetchAccessToken, userLogout } from "../../controllers/auth/auth.controller.ts";
import validate from "express-zod-safe";
import { UserLoginSchema, UserSignupSchema, UserTokenSchema } from "../../schemas/users.schema.ts";

// /auth/users
const router = express.Router();

router.post("/signup", validate({ body: UserSignupSchema }), userSignup);
router.post("/login", validate({ body: UserLoginSchema }), userLogin);
router.post("/token", validate({ body: UserTokenSchema }), fetchAccessToken);
router.post("/logout", validate({ body: UserTokenSchema }), userLogout);

export default router;
