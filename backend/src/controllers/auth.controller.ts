import type { Request, Response } from "express";
import handleError from "../util/handleError.ts";
import type { UsernameSchema } from "../schemas/users.schema.ts";
import DB from "../db/api.ts";
import type { User } from "../types/User.ts";
import type { ValidatedRequest } from "express-zod-safe";

export const createUser = async (req: ValidatedRequest<{ body: typeof UsernameSchema }>, res: Response) => {
    const { username } = req.body;

    try {
        await DB().query("INSERT INTO users (username) VALUES ($1)", [username]);
        return res.sendStatus(201);
    } catch (e) {
        handleError(e, res);
    }
};

export const getUser = async (req: ValidatedRequest<{ params: typeof UsernameSchema }>, res: Response) => {
    const { username } = req.params;

    try {
        const data = await DB().query<User>("SELECT * FROM users WHERE username = $1", [username]);

        if (data.length === 0) {
            return res.status(404).json({ reason: "User not found." });
        }

        return res.status(200).json({ data });
    } catch (e) {
        handleError(e, res);
    }
};
