import axios from "axios"

// || "http://localhost:3000"

// console.log(import.meta.env.VITE_API_URL)
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ,
    withCredentials: true,
    headers: {
        "Content-Type": 'application/json'
    },
})
export default axiosClient;