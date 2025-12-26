// src/services/reportService.js
import axios from "../api/api";

export const fetchIdeaReports = async (ideaId) => {
  try {
    // تصحيح المسار: يجب أن يكون نفس المسار في الـ Route
    const response = await axios.get(`/idea/${ideaId}/reports`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};