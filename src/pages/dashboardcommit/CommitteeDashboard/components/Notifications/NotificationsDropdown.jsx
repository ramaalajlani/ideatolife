// src/pages/dashboardcommit/CommitteeDashboard/components/Notifications/NotificationsDropdown.jsx
import React from "react";
import { formatDate } from "../../utils/formatters";

const NotificationsDropdown = ({
  notifications,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose
}) => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">الإشعارات</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">جاري تحميل الإشعارات...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">لا توجد إشعارات</div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                !notification.is_read ? 'bg-blue-50' : ''
              }`}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-gray-800">{notification.message}</p>
                  <span className="text-xs text-gray-500 mt-1">
                    {formatDate(notification.created_at)}
                  </span>
                </div>
                {!notification.is_read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-gray-200">
        <button
          onClick={onMarkAllAsRead}
          className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
        >
          تحديد الكل كمقروء
        </button>
      </div>
    </div>
  );
};

export default NotificationsDropdown;