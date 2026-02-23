import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Attach Authorization header automatically if token exists
api.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        // localStorage may be undefined in some environments; ignore
    }
    return config;
});

export default api;
