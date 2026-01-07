import React from "react";

const DashboardHeader = ({ activeTab, tabs, userName }) => {
  return (
    <header className="h-20 bg-[#FFD586] border-b border-gray-200 flex items-center justify-between px-10">
      <div>
        <h1 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
          Dashboard <span className="text-gray-600">/</span> 
          <span className="text-gray-900">{tabs.find(t => t.id === activeTab)?.label}</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs font-bold text-gray-900">{userName}</p>
          <p className="text-[10px] text-gray-700 uppercase tracking-tight">Active Now</p>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;