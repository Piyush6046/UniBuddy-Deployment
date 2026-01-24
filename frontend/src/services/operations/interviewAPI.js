import { toast } from "react-hot-toast";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:4000/api/v1";

export const startInterview = async (resume, jobDescription, token) => {
    const toastId = toast.loading("Processing Resume & Starting Interview...");
    try {
        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("jobDescription", jobDescription);

        const response = await axios.post(`${BASE_URL}/interview/start`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("Interview Session Created!");
        return response.data.assistant;
    } catch (error) {
        console.error("START_INTERVIEW_ERROR", error);
        toast.error(error.response?.data?.message || "Failed to start interview");
        return null;
    } finally {
        toast.dismiss(toastId);
    }
};
