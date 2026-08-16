import bcrypt from "bcrypt";
import DB from "../db/db.ts";
import { TEST_USER } from "./util.ts";

const seed = async () => {
    const passwordHash = await bcrypt.hash("password", 10);
    await DB().query(
        `INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)`,
        [TEST_USER.username, TEST_USER.email, passwordHash],
    );
};

export default seed;
