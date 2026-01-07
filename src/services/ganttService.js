
import api from "./api";

const ganttService = {
  getPhases: async (ideaId) => {
    try {
      const response = await api.get(`/gantt-charts/${ideaId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Gantt phases:", error);
      throw error.response?.data || { message: "فشل في جلب المراحل" };
    }
  },

  submitFullTimeline: async (ideaId) => {
    try {
      const response = await api.post(`/ideas/${ideaId}/submit-timeline`);
      return response.data;
    } catch (error) {
      console.error("Error submitting timeline:", error);
      throw error.response?.data || { message: "فشل في إرسال الجدول الزمني" };
    }
  },

  createPhase: async (ideaId, phaseData) => {
    try {
      const response = await api.post(`/gantt-charts/${ideaId}`, phaseData);
      return response.data;
    } catch (error) {
      console.error("Error creating Gantt phase:", error);
      throw error.response?.data || { message: "فشل في إنشاء المرحلة" };
    }
  },

  updatePhase: async (phaseId, phaseData) => {
    try {
      const response = await api.put(`/gantt-charts/${phaseId}`, phaseData);
      return response.data;
    } catch (error) {
      console.error("Error updating Gantt phase:", error);
      throw error.response?.data || { message: "فشل في تحديث المرحلة" };
    }
  },

  deletePhase: async (phaseId) => {
    try {
      const response = await api.delete(`/gantt-charts/${phaseId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting Gantt phase:", error);
      throw error.response?.data || { message: "فشل في حذف المرحلة" };
    }
  },

  getPhaseEvaluation: async (ideaId, ganttId) => {
    try {
      const response = await api.get(
        `/ideas/${ideaId}/gantt/${ganttId}/evaluation`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching phase evaluation:", error);
      return null;
    }
  },
};

export default ganttService;
