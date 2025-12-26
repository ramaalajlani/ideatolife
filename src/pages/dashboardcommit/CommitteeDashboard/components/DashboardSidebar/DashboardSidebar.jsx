// src/pages/dashboardcommit/components/DashboardSidebar/DashboardSidebar.jsx
import React from "react";

const DashboardSidebar = ({ activeTab, onTabChange, userData, onLogout }) => {
  const tabs = [
    { id: "ideas", label: "Assigned Ideas" },
    { id: "evaluations", label: "Evaluations" },
    { id: "meetings", label: "Meetings" },
    { id: "bmcs", label: "Business Models" },
    { id: "fundingRequests", label: "Funding Requests" },
    { id: "fundingChecks", label: "Funding Checks" }
  ];

  return (
    <div className="w-72 bg-[#0F1115] text-white h-full flex flex-col border-r border-white/5">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-12">

          <h2 className="text-xl font-black tracking-tighter italic">
        commite<span className="text-orange-500">    member</span>
          </h2>
        </div>
        
        <nav className="space-y-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 px-4">Management</p>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full text-left px-4 py-3.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-xl'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-800 flex items-center justify-center text-xs font-bold border-2 border-white/10">
            {userData?.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-none">{userData?.name}</p>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tight">{userData?.role}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="mt-4 w-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white py-2 px-4 rounded-lg hover:bg-white/5 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;