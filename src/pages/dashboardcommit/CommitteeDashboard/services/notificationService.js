// src/pages/dashboardcommit/CommitteeDashboard/services/notificationService.js
import { apiService } from './apiService';

export const notificationService = {
  async getNotifications() {
    try {
      return await apiService.get('/notifications/owner');
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  async markAsRead(notificationId) {
    try {
      await apiService.post(`/notifications/${notificationId}/read`);
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
};