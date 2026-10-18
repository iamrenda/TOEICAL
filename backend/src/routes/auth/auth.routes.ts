import express from "express";
import rateLimit from "express-rate-limit";
import { sendError } from "../../util/sendResponse.ts";
import { ErrorCode } from "@toeical/shared";
import {
    userLogin,
    userSignup,
    fetchAccessToken,
    userLogout,
} from "../../controllers/auth/auth.controller.ts";
import validate from "express-zod-safe";
import { UserLoginSchema, UserSignupSchema, UserTokenSchema } from "../../schemas/users.schema.ts";

// /auth/users
const router = express.Router();

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res) =>
        sendError(
            res,
            429,
            "アクセスが集中しています。しばらく時間を置いてから再度お試しください。",
            ErrorCode.TOO_MANY_REQUESTS,
        ),
});

router.use(rateLimiter);
router.post("/signup", validate({ body: UserSignupSchema }), userSignup);
router.post("/login", validate({ body: UserLoginSchema }), userLogin);
router.post("/token", validate({ body: UserTokenSchema }), fetchAccessToken);
router.post("/logout", validate({ body: UserTokenSchema }), userLogout);

export default router;
