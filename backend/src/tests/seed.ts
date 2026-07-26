import bcrypt from "bcrypt";
import DB from "../db/db.ts";

export const TEST_USER = {
    username: "testing",
    email: "test@example.com",
    password: "password",
};

const seed = async () => {
    const passwordHash = await bcrypt.hash("password", 10);
    await DB().query(
        `INSERT INTO users (username, email, password)
        VALUES VALUES ($1, $2, $3)`,
        [TEST_USER.username, TEST_USER.email, passwordHash],
    );
};

export default seed;
