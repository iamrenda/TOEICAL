import axios from "axios";

const TIMEOUT_IN_MS = 5000;

const api = axios.create({
    baseURL: "",
    headers: { "Content-Type": "application/json" },
    timeout: TIMEOUT_IN_MS,
});

export default api;
