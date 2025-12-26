// src/services/fundingService.js (محدث)
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    };
};

const fundingService = {
  // طلب تمويل جديد (للفكرة العامة)
  requestFunding: async (ideaId, fundingData) => {
    try {
      const response = await axios.post(
        `${API_URL}/ideas/${ideaId}/funding-request`,
        fundingData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error requesting funding:', error);
      throw error.response?.data || { message: 'فشل في تقديم طلب التمويل' };
    }
  },

  // طلب تمويل للمرحلة (جديدة)
  requestPhaseFunding: async (ganttId, data) => {
    try {
      const response = await axios.post(
        `${API_URL}/funding/request/gantt/${ganttId}`,
        data,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error requesting phase funding:', error);
      throw error.response?.data || { message: 'فشل في تقديم طلب تمويل المرحلة' };
    }
  },

  // طلب تمويل للمهمة (جديدة)
  requestTaskFunding: async (taskId, data) => {
    try {
      const response = await axios.post(
        `${API_URL}/funding/request/task/${taskId}`,
        data,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error requesting task funding:', error);
      throw error.response?.data || { message: 'فشل في تقديم طلب تمويل المهمة' };
    }
  },

  // إلغاء طلب التمويل
  cancelFunding: async (fundingId, cancellationData) => {
    try {
      const response = await axios.post(
        `${API_URL}/ideas/${fundingId}/cancel-funding`,
        cancellationData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error cancelling funding:', error);
      throw error.response?.data || { message: 'فشل في إلغاء طلب التمويل' };
    }
  },

  // جلب طلبات التمويل لفكرة معينة
  getFundingForIdea: async (ideaId) => {
    try {
      const response = await axios.get(
        `${API_URL}/my-ideas/${ideaId}/funding`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching funding:', error);
      // إذا كان الخطأ 404، نعيد بيانات فارغة
      if (error.response?.status === 404) {
        return {
          idea_id: ideaId,
          idea_title: 'فكرة التمويل',
          fundings: []
        };
      }
      throw error.response?.data || { message: 'فشل في جلب طلبات التمويل' };
    }
  },

  // الحصول على طلبات التمويل للمرحلة (جديدة)
  getPhaseFundingRequests: async (ganttId) => {
    try {
      const response = await axios.get(
        `${API_URL}/funding/gantt/${ganttId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching phase funding:', error);
      // إذا لم يكن الـ API موجوداً بعد، نرجع بيانات فارغة
      if (error.response?.status === 404) {
        return { data: [] };
      }
      throw error.response?.data || { message: 'فشل في جلب طلبات تمويل المرحلة' };
    }
  },

  // الحصول على طلبات التمويل للمهمة (جديدة)
  getTaskFundingRequests: async (taskId) => {
    try {
      const response = await axios.get(
        `${API_URL}/funding/task/${taskId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching task funding:', error);
      // إذا لم يكن الـ API موجوداً بعد، نرجع بيانات فارغة
      if (error.response?.status === 404) {
        return { data: [] };
      }
      throw error.response?.data || { message: 'فشل في جلب طلبات تمويل المهمة' };
    }
  },

  // التحقق من أهلية طلب التمويل
  checkFundingEligibility: async (ideaId) => {
    try {
      // يمكنك إنشاء endpoint منفصل في Laravel للتحقق
      // مؤقتاً نعود بقيم افتراضية
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
      console.error('Error checking eligibility:', error);
      throw { message: 'فشل في التحقق من أهلية التمويل' };
    }
  }
};

export default fundingService;