import api from "./api";

const meetingService = {
  // جلب الاجتماعات القادمة لفكرة معينة
  getUpcomingMeetings: async (ideaId) => {
    try {
      const response = await api.get(`/idea/${ideaId}/meetings/upcoming`);
      return response.data;
    } catch (error) {
      console.error("Error fetching meetings:", error);
      throw error.response?.data || { message: "فشل في تحميل الاجتماعات" };
    }
  },

  // دالة مساعدة للتحقق من المصادقة
  checkAuth: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  // إنشاء اجتماع جديد
  createMeeting: async (meetingData) => {
    try {
      const response = await api.post("/meetings", meetingData);
      return response.data;
    } catch (error) {
      console.error("Error creating meeting:", error);
      throw error.response?.data || { message: "فشل في إنشاء الاجتماع" };
    }
  },

  // تحديث اجتماع
  updateMeeting: async (meetingId, meetingData) => {
    try {
      const response = await api.put(`/committee/meetings/${meetingId}`, meetingData);
      return response.data;
    } catch (error) {
      console.error("Error updating meeting:", error);
      throw error.response?.data || { message: "فشل في تحديث الاجتماع" };
    }
  },
};

export default meetingService;
