// src/services/notificationService.js
import api from "./api";

const notificationService = {
  getOwnerNotifications: async () => {
    const response = await api.get("/notifications/owner");
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.post(`/notifications/mark-all-read`);
    return response.data;
  }
};

export default notificationService;
