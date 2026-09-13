import DB from "../db/db.ts";
import seed from "./seed.ts";

const truncateAll = async () => {
    const tables = [
        "users",
        "writing_topics",
        "writing_results",
        "users_writing",
        "writing_tags",
        "writing_topic_tags",
    ];
    for (const table of tables) {
        await DB().query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`);
    }
};

beforeAll(async () => {
    await truncateAll();
    await seed();
});
