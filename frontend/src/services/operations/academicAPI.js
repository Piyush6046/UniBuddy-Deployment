import axios from "axios";
import { toast } from "react-hot-toast";
import { getAuthHeaders } from "../../utils/authHeader";

const Backend_url = import.meta.env.VITE_BACKEND_URL;
const BASE_URL = `${Backend_url}/api/academic`;

// Get Academic Data
export const getAcademicData = async () => {
    try {
        const response = await axios.get(BASE_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch academic data";
        toast.error(message);
        throw error;
    }
};

// Add or Update Semester
export const addOrUpdateSemester = async (semesterData) => {
    const toastId = toast.loading("Saving semester data...");
    try {
        const response = await axios.post(
            `${BASE_URL}/semester`,
            semesterData,
            getAuthHeaders()
        );
        toast.success("Semester data saved successfully!");
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Failed to save semester data";
        toast.error(message);
        throw error;
    } finally {
        toast.dismiss(toastId);
    }
};

// Delete Semester
export const deleteSemester = async (semesterNumber) => {
    const toastId = toast.loading("Deleting semester...");
    try {
        const response = await axios.delete(
            `${BASE_URL}/semester/${semesterNumber}`,
            getAuthHeaders()
        );
        toast.success("Semester deleted successfully!");
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Failed to delete semester";
        toast.error(message);
        throw error;
    } finally {
        toast.dismiss(toastId);
    }
};

// Set Target CGPA
export const setTargetCGPA = async (targetCGPA) => {
    const toastId = toast.loading("Setting target CGPA...");
    try {
        const response = await axios.put(
            `${BASE_URL}/target`,
            { targetCGPA },
            getAuthHeaders()
        );
        toast.success("Target CGPA set successfully!");
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Failed to set target CGPA";
        toast.error(message);
        throw error;
    } finally {
        toast.dismiss(toastId);
    }
};

// Predict Target CGPA
export const predictTargetCGPA = async (predictionData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/predict`,
            predictionData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Failed to predict target CGPA";
        toast.error(message);
        throw error;
    }
};
