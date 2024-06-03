import axios from "axios"
import toast from "react-hot-toast";

// export const URL: string = "http://localhost:3000/api"
export const URL: string = "https://password-generator-server.onrender.com/api"

const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true
})

axiosInstance.interceptors.response.use((response) => {
    return response.data;
})

export const commonRequest = async (method: string, url: string, data: object, headers: object) => {
    const requestConfig = {
        method,
        url,
        data,
        headers
    }

    try {
        const response =await axiosInstance(requestConfig)
        return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.log("🚀 ~ commonRequest ~ error:", error)
        toast.error((error.message))
        return error;
    }
}