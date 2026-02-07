import { toast } from "react-hot-toast";
import axios from "axios";

const Backend_url = import.meta.env.VITE_BACKEND_URL;
const BASE_URL = `${Backend_url}/api/v1`;

export const startInterview = async (resume, jobDescription, token, duration = 300) => {
    const toastId = toast.loading("Processing Resume & Starting Interview...");
    try {
        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("jobDescription", jobDescription);
        formData.append("duration", duration);

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
        return response.data;
    } catch (error) {
        console.error("START_INTERVIEW_ERROR", error);
        // Do not toast here if it's a 403, handle it in the component
        if (error.response?.status !== 403) {
            toast.error(error.response?.data?.message || "Failed to start interview");
        }
        throw error;
    } finally {
        toast.dismiss(toastId);
    }
};

export const getInterviewHistory = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/interview/history`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        return response.data; // Returns { interviews, stats }
    } catch (error) {
        console.error("GET_INTERVIEW_HISTORY_ERROR", error);
        toast.error("Failed to fetch interview history");
        return { interviews: [], stats: {} };
    }
};

export const getInterviewDetails = async (interviewId, token) => {
    try {
        const response = await axios.get(`${BASE_URL}/interview/details/${interviewId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        return response.data.interview;
    } catch (error) {
        console.error("GET_INTERVIEW_DETAILS_ERROR", error);
        toast.error("Failed to fetch interview details");
        throw error;
    }
};

// Admin APIs
export const getAllInterviewsAdmin = async (token, page = 1, filters = {}) => {
    try {
        const params = new URLSearchParams({ page, ...filters });
        const response = await axios.get(`${BASE_URL}/interview/admin/all?${params}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        return response.data; // Returns { interviews, pagination, analytics }
    } catch (error) {
        console.error("GET_ALL_INTERVIEWS_ADMIN_ERROR", error);
        toast.error("Failed to fetch interviews");
        throw error;
    }
};

export const getInterviewDetailsAdmin = async (interviewId, token) => {
    try {
        const response = await axios.get(`${BASE_URL}/interview/admin/details/${interviewId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        return response.data.interview;
    } catch (error) {
        console.error("GET_INTERVIEW_DETAILS_ADMIN_ERROR", error);
        toast.error("Failed to fetch interview details");
        throw error;
    }
};
