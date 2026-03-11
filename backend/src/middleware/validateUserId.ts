import type { NextFunction, Request, Response } from "express";
import { UserIdSchema } from "../schemas/users.schema.ts";

const vaildateUserId = () => (req: Request, res: Response, next: NextFunction) => {
    const result = UserIdSchema.safeParse(req.params);

    if (!result.success) {
        console.log(result.error);
        return res.status(400).json({ reason: "Invalid user ID" });
    }

    req.body = result.data;
    next();
};

export default vaildateUserId;
