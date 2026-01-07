
import api from "./api";

const fundingService = {

  requestFunding: async (ideaId, fundingData) => {
    try {
      const response = await api.post(`/ideas/${ideaId}/funding-request`, fundingData);
      return response.data;
    } catch (error) {
      console.error("Error requesting funding:", error);
      throw error.response?.data || { message: "فشل في تقديم طلب التمويل" };
    }
  },

  requestPhaseFunding: async (ganttId, data) => {
    try {
      const response = await api.post(`/funding/request/gantt/${ganttId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error requesting phase funding:", error);
      throw error.response?.data || { message: "فشل في تقديم طلب تمويل المرحلة" };
    }
  },


  requestTaskFunding: async (taskId, data) => {
    try {
      const response = await api.post(`/funding/request/task/${taskId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error requesting task funding:", error);
      throw error.response?.data || { message: "فشل في تقديم طلب تمويل المهمة" };
    }
  },

  cancelFunding: async (fundingId, cancellationData) => {
    try {
      const response = await api.post(`/ideas/${fundingId}/cancel-funding`, cancellationData);
      return response.data;
    } catch (error) {
      console.error("Error cancelling funding:", error);
      throw error.response?.data || { message: "فشل في إلغاء طلب التمويل" };
    }
  },

  getFundingForIdea: async (ideaId) => {
    try {
      const response = await api.get(`/my-ideas/${ideaId}/funding`);
      return response.data;
    } catch (error) {
      console.error("Error fetching funding for idea:", error);
      if (error.response?.status === 404) return { idea_id: ideaId, fundings: [] };
      throw error.response?.data || { message: "فشل في جلب طلبات التمويل" };
    }
  },

  getPhaseFundingRequests: async (ganttId) => {
    try {
      const response = await api.get(`/funding/request/gantt/${ganttId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching phase funding:", error);
      if (error.response?.status === 404) return { data: [] };
      throw error.response?.data || { message: "فشل في جلب طلبات تمويل المرحلة" };
    }
  },

  getTaskFundingRequests: async (taskId) => {
    try {
      const response = await api.get(`/funding/request/task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching task funding:", error);
      if (error.response?.status === 404) return { data: [] };
      throw error.response?.data || { message: "فشل في جلب طلبات تمويل المهمة" };
    }
  },

  checkFundingEligibility: async (ideaId) => {
    try {

      return {
        business_plan_completed: true,
        business_plan_score: 85,
        minimum_score_achieved: true,
        no_pending_requests: true,
        committee_assigned: true,
        investor_available: true,
        roadmap: {
          current_stage: "التمويل",
          progress_percentage: 60,
          next_step: "انتظار قرار اللجنة بخصوص التمويل",
          stage_description: "يمكنك الآن تقديم طلب التمويل"
        }
      };
    } catch (error) {
      console.error("Error checking eligibility:", error);
      throw { message: "فشل في التحقق من أهلية التمويل" };
    }
  }
};

export default fundingService;
