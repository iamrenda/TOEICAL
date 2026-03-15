import type { JwtPayload } from "jsonwebtoken";

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: string;
}

export type UserTokenPayload = User & JwtPayload;
