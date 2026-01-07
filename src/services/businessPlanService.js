
import api from "./api";
const businessPlanService = {
  getBusinessPlan: async (ideaId) => {
    try {
      const response = await api.get(`/idea/${ideaId}/bmc`);
      return response.data;
    } catch (error) {
      console.error("Error fetching business plan:", error);

      if (error.response?.status === 404 || error.response?.status === 405) {
   
        return null;
      }

      throw error.response?.data || { message: "فشل في جلب خطة العمل" };
    }
  },

  saveBusinessPlan: async (ideaId, businessPlanData) => {
    try {
      const response = await api.post(`/ideas/${ideaId}/business-plan`, businessPlanData);
      return response.data;
    } catch (error) {
      console.error("Error saving business plan:", error);
      throw error.response?.data || { message: "فشل في حفظ خطة العمل" };
    }
  },

  updateBusinessPlan: async (ideaId, businessPlanData) => {
    try {
      const response = await api.post(`/ideas/${ideaId}/update-bmc`, businessPlanData);
      return response.data;
    } catch (error) {
      console.error("Error updating business plan:", error);
      throw error.response?.data || { message: "فشل في تحديث خطة العمل" };
    }
  },

  checkEligibility: async (ideaId) => {
    try {
      const response = await api.get(`/ideas/${ideaId}/eligibility`);
      return response.data;
    } catch (error) {
      console.log("Eligibility check not available:", error);
      // قيمة افتراضية إذا لم يكن الـ endpoint متاح
      return {
        eligible: true,
        score: 85,
        message: "يمكنك البدء في ملء خطة العمل"
      };
    }
  }
};

export default businessPlanService;
