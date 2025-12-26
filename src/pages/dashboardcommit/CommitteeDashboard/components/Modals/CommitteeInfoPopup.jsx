// src/pages/dashboardcommit/CommitteeDashboard/components/Modals/CommitteeInfoPopup.jsx
import React from "react";

const CommitteeInfoPopup = ({ show, onClose, name, description, status, role, members }) => {
  if (!show) return null;

  const getStatusBadge = (status) => {
    const config = {
      active: { color: "bg-green-100 text-green-800", text: "نشطة" },
      inactive: { color: "bg-red-100 text-red-800", text: "غير نشطة" },
      pending: { color: "bg-yellow-100 text-yellow-800", text: "قيد الانتظار" }
    };
    return config[status?.toLowerCase()] || { color: "bg-gray-100 text-gray-800", text: status };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">الوصف</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {description || "لا يوجد وصف متاح"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">حالة اللجنة</h3>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(status).color}`}>
                {getStatusBadge(status).text}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">دورك في اللجنة</h3>
              <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full inline-block font-medium">
                {role}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">أعضاء اللجنة ({members.length})</h3>
            
            {members.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">لا يوجد أعضاء بعد</p>
              </div>
            ) : (
              <div className="space-y-3">
                {members.map(member => (
                  <div 
                    key={member.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      member.is_me 
                        ? "border-blue-300 bg-blue-50" 
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        member.is_me ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                      }`}>
                        {member.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.role_in_committee}</div>
                      </div>
                    </div>
                    
                    {member.is_me && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        أنت
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommitteeInfoPopup;