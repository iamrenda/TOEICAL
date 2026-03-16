import type { JwtPayload } from "jsonwebtoken";

export interface UserEntity {
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: string;
}

export type UserTokenPayload = Pick<UserEntity, "id" | "username" | "email"> & JwtPayload;
