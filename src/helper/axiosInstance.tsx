import axios from "axios";

const URL =     import.meta.env.DEV ? import.meta.env.VITE_API_URL_DEV : import.meta.env.VITE_API_URL_PROD

export const axiosInstance = axios.create({
    baseURL: URL,
    headers: {
        'Content-Type':'application/json'
    },
    withCredentials:true
})