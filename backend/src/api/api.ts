import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TIMEOUT_IN_MS = 120_000;

const api = axios.create({
    baseURL: process.env.FASTAPI_URL!,
    headers: { "Content-Type": "application/json" },
    timeout: TIMEOUT_IN_MS,
});

export default api;
