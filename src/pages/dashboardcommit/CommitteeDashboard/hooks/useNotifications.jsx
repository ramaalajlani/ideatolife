// src/pages/dashboardcommit/CommitteeDashboard/hooks/useNotifications.js
import { useState, useCallback, useEffect } from "react";
import { notificationService } from "../services/notificationService";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      
      if (data) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      const success = await notificationService.markAsRead(notificationId);
      
      if (success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: true }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter(notif => !notif.is_read);
    
    for (const notif of unreadNotifications) {
      await markAsRead(notif.id);
    }
  }, [notifications, markAsRead]);

  const toggleNotifications = useCallback(() => {
    setShowNotifications(prev => {
      if (!prev) {
        fetchNotifications();
      }
      return !prev;
    });
  }, [fetchNotifications]);

  // Auto-fetch notifications periodically
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 60000); // كل دقيقة
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    showNotifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    toggleNotifications
  };
};

export default useNotifications;