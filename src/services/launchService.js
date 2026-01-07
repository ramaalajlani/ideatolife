import api from "./api";

const launchService = {
  // طلب إطلاق المشروع
  requestLaunch: async (ideaId, data) => {
    try {
      const response = await api.post(`/ideas/${ideaId}/launch-request`, data);
      return response.data;
    } catch (error) {
      console.error("Error requesting launch:", error);
      throw (
        error.response?.data || { message: "فشل في تقديم طلب إطلاق المشروع" }
      );
    }
  },

  // الحصول على طلبات الإطلاق الخاصة بي
  getMyLaunchRequests: async () => {
    try {
      const response = await api.get("/my-launch-requests");
      return response.data;
    } catch (error) {
      console.error("Error fetching my launch requests:", error);
      throw error.response?.data || { message: "فشل في جلب طلبات الإطلاق" };
    }
  },

  // الحصول على قرار اللجنة لطلب إطلاق فكرة معينة
  getLaunchDecision: async (ideaId) => {
    try {
      const response = await api.get(`/ideas/${ideaId}/launch-decision`);
      return response.data;
    } catch (error) {
      console.error("Error fetching launch decision:", error);
      throw error.response?.data || { message: "فشل في جلب قرار الإطلاق" };
    }
  },

  // طلب تمويل بعد الموافقة على الإطلاق
  requestFunding: async (ideaId, data) => {
    try {
      const response = await api.post(`/ideas/${ideaId}/request-funding`, data);
      return response.data;
    } catch (error) {
      console.error("Error requesting funding:", error);
      throw error.response?.data || { message: "فشل في تقديم طلب التمويل" };
    }
  },
};

export default launchService;
