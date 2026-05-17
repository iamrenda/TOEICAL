import { Pool, type PoolClient } from "pg";
import dotenv from "dotenv";
import ApiError from "../util/ApiError.ts";

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
});

// https://www.postgresql.org/docs/current/errcodes-appendix.html
const errorMapping: Record<string, { status: number; message: string }> = {
    "23503": { status: 400, message: "Related record not found." },
    "22P02": { status: 400, message: "Invalid input format." },
    "23505": { status: 409, message: "This record already exists." },
    "42P01": { status: 500, message: "Database configuration error (Table missing)." },
    "57P01": { status: 503, message: "Database is shutting down." },
    "08006": { status: 503, message: "Database connection failed." },
};

const DB = () => {
    const getPool = async () => {
        try {
            return await pool.connect();
        } catch (e) {
            console.error(e);
            return new ApiError(500, "Unable to connect to the database");
        }
    };

    const api = {
        query: async <T>(sql: string, params: any[] = []) => {
            const db = await getPool();

            if (db instanceof ApiError) {
                throw db;
            }

            try {
                const result = await db.query(sql, params);
                return result.rows as T[];
            } catch (e) {
                const error = errorMapping[(e as any).code];
                if (error) {
                    throw new ApiError(error.status, error.message);
                }
                throw new ApiError(500, "An unexpected error occurred.");
            } finally {
                db.release();
            }
        },
        transaction: async <T>(
            callback: (client: { query: <U>(sql: string, params?: any[]) => Promise<U[]> }) => Promise<T>,
        ) => {
            const client: PoolClient | ApiError = await getPool();
            if (client instanceof ApiError) {
                throw client;
            }

            try {
                await client.query("BEGIN");

                const query = async <U>(sql: string, params: any[] = []) => {
                    try {
                        const result = await client.query(sql, params);
                        return result.rows as U[];
                    } catch (e) {
                        const error = errorMapping[(e as any).code];
                        throw error
                            ? new ApiError(error.status, error.message)
                            : new ApiError(500, "An unexpected error occurred.");
                    }
                };

                const result = await callback({ query });

                await client.query("COMMIT");
                return result;
            } catch (e) {
                try {
                    await client.query("ROLLBACK");
                } catch (rollbackError) {
                    console.error("Failed to rollback transaction:", rollbackError);
                }
                throw e;
            } finally {
                client.release();
            }
        },
    };

    return api;
};

export default DB;
