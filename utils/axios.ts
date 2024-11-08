// src/axiosInstance.js
import { BACKEND_URL } from "@/config";
import axios from "axios";

// Create an Axios instance with a base URL
const AxiosInstance = axios.create({
    baseURL: `${BACKEND_URL}`,  // Set your base URL here
    headers: {
        'Content-Type': 'application/json',
    }
});

export default AxiosInstance;
