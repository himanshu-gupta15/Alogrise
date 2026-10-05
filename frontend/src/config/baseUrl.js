// API origin. Local development reads VITE_API_URL from frontend/.env;
// production builds fall back to the backend deployed on Vercel.
const BASE_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4000" : "https://alogrise.vercel.app")).replace(/\/+$/, "");

export default BASE_URL;
