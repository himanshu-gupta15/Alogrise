import axios from "axios";
import BASE_URL from "../config/baseUrl";

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // CRITICAL: This allows cookies to be sent/received
});

export default axiosClient;
