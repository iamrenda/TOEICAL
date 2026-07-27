import DB from "../db/db.ts";
import seed from "./seed.ts";

const truncateAll = async () => {
    await DB().query(`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`);
};

beforeEach(async () => {
    await truncateAll();
    await seed();
});
