import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
});

const DB = () => {
    const getPool = async () => {
        try {
            return await pool.connect();
        } catch (e) {
            console.error(e);
            return new Error("Unable to connect to the database");
        }
    };

    const api = {
        query: async <T>(sql: string, params: any[] = []) => {
            const db = await getPool();

            if (db instanceof Error) {
                throw new Error("Unable to connect to the database");
            }

            try {
                const result = await db.query(sql, params);
                return result.rows as T[];
            } catch (e) {
                console.error(e);
                throw new Error("Query execution failed");
            } finally {
                db.release();
            }
        },
    };

    return api;
};

export default DB;
