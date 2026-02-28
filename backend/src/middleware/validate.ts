import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

const vaildate = (schema: z.ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    console.log(result.error);

    if (!result.success) {
        return res.status(400).json({ reason: "Invalid request body" });
    }

    req.body = result.data;
    next();
};

export default vaildate;
