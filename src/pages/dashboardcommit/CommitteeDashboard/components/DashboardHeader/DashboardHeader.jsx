import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Clock, BellOff, CreditCard } from "lucide-react";
import axios from "axios";

const DashboardHeader = ({ activeTab, tabs, userName, token }) => {
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [wallet, setWallet] = useState(null);
  const dropdownRef = useRef();

  // جلب الإشعارات
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/notifications/owner", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data.notifications || []);
        setCount(response.data.count || 0);
      } catch (error) {
        console.error("خطأ في جلب الإشعارات", error);
      }
    };
    fetchNotifications();
  }, [token]);

  // جلب المحفظة
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/my_wallet", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWallet(response.data.wallet || null);
      } catch (error) {
        console.error("خطأ في جلب المحفظة", error);
      }
    };
    fetchWallet();
  }, [token]);

  const markAsRead = async (id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("فشل في تمييز الإشعار كمقروء:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.is_read);
      await Promise.all(
        unreadNotifications.map((n) =>
          axios.post(
            `http://127.0.0.1:8000/api/notifications/${n.id}/read`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setCount(0);
    } catch (error) {
      console.error("فشل في تمييز الإشعارات كمقروء:", error);
    }
  };

  // إغلاق Dropdown عند الضغط خارج
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#FFD586] border-b border-black/5 flex items-center justify-between px-6 md:px-10 z-50 text-left">
        {/* العنوان */}
        <div className="flex-1 flex justify-center">
          <h1 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2 text-center">
            Dashboard <span className="text-gray-500 font-light">/</span>
            <span className="text-gray-900">
              {tabs.find((t) => t.id === activeTab)?.label}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-4 md:gap-6 relative" ref={dropdownRef}>
          {/* إشعارات */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`relative p-3 rounded-2xl transition-all duration-300 flex items-center justify-center ${
                dropdownOpen ? "bg-white shadow-md scale-105" : "hover:bg-black/5"
              }`}
              title="Notifications"
            >
              <Bell className={`w-6 h-6 ${dropdownOpen ? "text-orange-600" : "text-gray-800"}`} />
              {count > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FFD586]">
                  {count > 9 ? "+9" : count}
                </span>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                {/* Header */}
                <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">الإشعارات</span>
                    {count > 0 && (
                      <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {count} جديدة
                      </span>
                    )}
                  </div>
                  <button
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition"
                    onClick={markAllAsRead}
                  >
                    <CheckCheck className="w-3 h-3" /> تمييز الكل كمقروء
                  </button>
                </div>

                {/* Body */}
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar text-left">
                  {notifications.length === 0 ? (
                    <div className="py-12 flex flex-col items-start justify-center text-gray-400">
                      <BellOff className="w-10 h-10 mb-2 opacity-20" />
                      <p className="text-sm">لا توجد إشعارات حالياً</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`group relative px-5 py-4 border-b border-gray-50 transition-all ${
                          !n.is_read ? "bg-white" : "bg-gray-50/20 opacity-80"
                        } flex flex-col gap-2`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p
                            className={`text-sm leading-tight ${
                              !n.is_read ? "font-bold text-gray-900" : "font-medium text-gray-700"
                            }`}
                          >
                            {n.title}
                          </p>
                          <span className="text-[9px] text-gray-400 flex items-center gap-1 whitespace-nowrap">
                            <Clock className="w-3 h-3" />{" "}
                            {new Date(n.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 italic">
                          {n.message}
                        </p>
                        <p className="text-[9px] text-gray-400 mt-1 self-start group-hover:text-orange-400">
                          {new Date(n.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                        {!n.is_read && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="text-[10px] text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-full flex items-center gap-1 transition self-start"
                          >
                            <CheckCheck className="w-3 h-3" /> مقروء
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* المحفظة */}
          {wallet && (
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-2xl shadow-md">
              <CreditCard className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-bold text-gray-900">{wallet.balance}</span>
            </div>
          )}

          {/* User Info */}
          <div className="text-left hidden sm:block border-l border-black/10 pl-4 md:pl-6">
            <p className="text-xs font-bold text-gray-900">{userName}</p>
            <p className="text-[9px] font-medium text-gray-600 uppercase tracking-tighter flex items-center justify-start gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Active Now
            </p>
          </div>
        </div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e5e7eb;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #d1d5db;
          }
        `}</style>
      </header>

      {/* Padding لتجنب تغطية المحتوى أسفل الهيدر */}
      <div className="pt-20"></div>
    </>
  );
};

export default DashboardHeader;
