import axios from 'axios';

const API_URL = 'http://localhost:8000/api';
const ganttService = {

  getPhases: async (ideaId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/gantt-charts/${ideaId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Gantt phases:', error);
      throw error.response?.data || { message: 'فشل في جلب المراحل' };
    }
  },

  submitFullTimeline: async (ideaId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/ideas/${ideaId}/submit-timeline`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error('Error submitting timeline:', err);
      throw err.response?.data || { message: 'فشل في إرسال الجدول الزمني' };
    }
  },

  createPhase: async (ideaId, phaseData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/gantt-charts/${ideaId}`, phaseData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating Gantt phase:', error);
      throw error.response?.data || { message: 'فشل في إنشاء المرحلة' };
    }
  },

  updatePhase: async (phaseId, phaseData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/gantt-charts/${phaseId}`, phaseData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating Gantt phase:', error);
      throw error.response?.data || { message: 'فشل في تحديث المرحلة' };
    }
  },

  deletePhase: async (phaseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/gantt-charts/${phaseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting Gantt phase:', error);
      throw error.response?.data || { message: 'فشل في حذف المرحلة' };
    }
  },

  getPhaseEvaluation: async (ideaId, ganttId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/ideas/${ideaId}/gantt/${ganttId}/evaluation`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching phase evaluation:', error);

      return null;
    }
  }
};

export default ganttService;