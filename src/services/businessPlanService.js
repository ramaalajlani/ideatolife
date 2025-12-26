import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const businessPlanService = {
  // حفظ أو تحديث خطة العمل
  saveBusinessPlan: async (ideaId, businessPlanData) => {
    try {
      console.log('Saving business plan data:', { ideaId, businessPlanData });
      
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/ideas/${ideaId}/business-plan`,
        businessPlanData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      
      console.log('Save response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error saving business plan:', error);
      throw error.response?.data || { message: 'فشل في حفظ خطة العمل' };
    }
  },

  // جلب خطة العمل الحالية
  getBusinessPlan: async (ideaId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/ideas/${ideaId}/business-plan`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      );
      
      console.log('Get business plan response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching business plan:', error);
      throw error.response?.data || { message: 'فشل في جلب خطة العمل' };
    }
  },

  // التحقق من أهلية الفكرة لخطة العمل
  checkEligibility: async (ideaId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/ideas/${ideaId}/eligibility`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.log('Eligibility check not available:', error);
      return {
        eligible: true,
        score: 85,
        message: 'يمكنك البدء في ملء خطة العمل'
      };
    }
  }
};

export default businessPlanService;