import axios from "axios";
import { env } from "../config/env.ts";

const TIMEOUT_IN_MS = 120_000;

const api = axios.create({
    baseURL: env.FASTAPI_URL,
    headers: { "Content-Type": "application/json" },
    timeout: TIMEOUT_IN_MS,
});

export default api;
