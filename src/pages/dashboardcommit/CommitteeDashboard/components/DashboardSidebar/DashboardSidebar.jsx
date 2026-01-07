import React from "react";

const DashboardSidebar = ({ activeTab, onTabChange, userData, onLogout }) => {
  const tabs = [
    { 
      id: "ideas", 
      label: "Assigned Ideas" 
    },
    { 
      id: "evaluations", 
      label: "Evaluations" 
    },
    { 
      id: "meetings", 
      label: "Meetings" 
    },
    { 
      id: "bmcs", 
      label: "Business Models" 
    },
    { 
      id: "fundingRequests", 
      label: "Funding Requests" 
    },
    { 
      id: "fundingChecks", 
      label: "Funding Checks" 
    },
    { 
      id: "launchRequests", 
      label: "Launch Requests" 
    },
    { 
      id: "postLaunch", 
      label: "Post-Launch Followups" 
    },
    { 
      id: "gantt", 
      label: "Gantt Chart" 
    }
  ];

  return (
    <div className="w-64 bg-gray-900 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CM</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Committee Dashboard
            </h2>
            <p className="text-xs text-gray-400 mt-1">Management Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            Navigation
          </p>
          <div className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-600 to-orange-800 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile & Logout - ثابت في الأسفل */}
      <div className="mt-auto p-6 border-t border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-700 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">
              {userData?.name?.charAt(0) || "C"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {userData?.name || "Committee Member"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {userData?.role || "Committee Member"}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;