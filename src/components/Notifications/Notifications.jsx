import React, { useEffect, useState } from "react";
import { 
  Bell, 
  Check, 
  X, 
  ExternalLink,
  Filter,
  Settings,
  ChevronDown,
  Clock,
  Mail,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import notificationService from "../../services/notificationService";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, filter]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getOwnerNotifications();
      setNotifications(data.notifications || []);
      setTotalCount(data.count || 0);
      setUnreadCount(data.notifications?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error("خطأ في جلب الإشعارات", error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    if (filter === "unread") {
      setFilteredNotifications(notifications.filter(n => !n.is_read));
    } else if (filter === "read") {
      setFilteredNotifications(notifications.filter(n => n.is_read));
    } else {
      setFilteredNotifications([...notifications]);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("خطأ في تحديث حالة الإشعار", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("خطأ في تحديث جميع الإشعارات", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("خطأ في حذف الإشعار", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'alert':
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'message':
        return <Mail className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-orange-500" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">جاري تحميل الإشعارات...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header مثل اللي طلبت */}
        <div className="relative mb-12">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-300 to-orange-400 text-gray-800 px-6 py-2 rounded-t-lg text-sm font-medium z-10 flex items-center justify-center gap-2 shadow-md min-w-[140px] whitespace-nowrap">
            <Bell size={16} className="flex-shrink-0" />
            <span className="font-medium">Notifications</span>
          </div>
          
          <div className="border-b-2 border-gray-200/30 px-6 pt-8 pb-4 bg-gradient-to-r from-slate-50 to-gray-100 rounded-t-lg mt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-sm" />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight break-words">
                    {unreadCount > 0 ? `${unreadCount} Unread Notifications` : 'All Notifications'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {totalCount} total notifications
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter size={16} />
                    <span className="text-sm font-medium">
                      {filter === 'all' ? 'All' : 
                       filter === 'unread' ? 'Unread' : 'Read'}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[160px]">
                      <button
                        onClick={() => { setFilter('all'); setShowDropdown(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                      >
                        All notifications
                      </button>
                      <button
                        onClick={() => { setFilter('unread'); setShowDropdown(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                      >
                        Unread only
                      </button>
                      <button
                        onClick={() => { setFilter('read'); setShowDropdown(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                      >
                        Read only
                      </button>
                    </div>
                  )}
                </div>
                
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Check size={16} />
                    Mark all as read
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No notifications
              </h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? "You're all caught up!" 
                  : filter === 'unread' 
                    ? "No unread notifications" 
                    : "No read notifications"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        !notification.is_read 
                          ? 'bg-blue-100 border-2 border-blue-200' 
                          : 'bg-gray-100'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={`font-medium ${
                          !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} />
                            {formatTime(notification.created_at)}
                          </span>
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-2">
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                          >
                            <Check size={14} />
                            Mark as read
                          </button>
                        )}
                        
                        {notification.link && (
                          <a
                            href={notification.link}
                            className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink size={14} />
                            View details
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Unread indicator */}
                    {!notification.is_read && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{totalCount}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
              <div className="text-sm text-gray-600">Unread</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalCount - unreadCount}</div>
              <div className="text-sm text-gray-600">Read</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;