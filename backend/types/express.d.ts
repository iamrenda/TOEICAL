import type { UserTokenPayload } from "../src/types/User.ts";

declare global {
    namespace Express {
        interface Request {
            user?: UserTokenPayload;
        }
    }
}
