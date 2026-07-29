import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'https://alogrise.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // CRITICAL: This allows cookies to be sent/received
});

export default axiosClient;
