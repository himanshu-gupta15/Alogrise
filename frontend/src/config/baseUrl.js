// API origin. Set VITE_API_URL in frontend/.env to point at a different backend.
const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/+$/, "");

export default BASE_URL;
