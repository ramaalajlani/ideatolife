import axios from 'axios';

// استخدام URL مباشرة بدلاً من process.env
const API_URL = 'http://localhost:8000/api';

const meetingService = {
  // جلب الاجتماعات القادمة لفكرة معينة
  getUpcomingMeetings: async (ideaId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/idea/${ideaId}/meetings/upcoming`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      throw error.response?.data || { message: 'فشل في تحميل الاجتماعات' };
    }
  },

  // دالة مساعدة للتحقق من المصادقة
  checkAuth: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // إنشاء اجتماع جديد (إذا كان مطلوباً)
  createMeeting: async (meetingData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/meetings`, meetingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error.response?.data || { message: 'فشل في إنشاء الاجتماع' };
    }
  },

  // تحديث اجتماع
  updateMeeting: async (meetingId, meetingData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/committee/meetings/${meetingId}`, meetingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error.response?.data || { message: 'فشل في تحديث الاجتماع' };
    }
  }
};

export default meetingService;