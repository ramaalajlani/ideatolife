import api from "../api/api";

const notificationService = {
  // جلب إشعارات المستخدم (owner)
  getOwnerNotifications: async () => {
    const response = await api.get("/notifications/owner");
    return response.data;
  },

  // تحديد إشعار كمقروء
  markAsRead: async (notificationId) => {
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  },
};

export default notificationService;
