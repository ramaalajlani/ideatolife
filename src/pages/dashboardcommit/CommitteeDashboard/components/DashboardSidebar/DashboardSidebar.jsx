import React from "react";
import { LogOut, User, Clipboard, FileText, Calendar, BarChart3, Layers, CheckCircle, Activity, ChevronRight } from "lucide-react";

const DashboardSidebar = ({ activeTab, onTabChange, userData, onLogout, withdrawalCount = 0 }) => {
  const tabs = [
    { id: "ideas", label: "Assigned Ideas", icon: <Clipboard size={20} /> },
    { id: "evaluations", label: "Evaluations", icon: <FileText size={20} /> },
    { id: "meetings", label: "Meetings", icon: <Calendar size={20} /> },
    { id: "bmcs", label: "Business Models", icon: <Layers size={20} /> },
    { id: "fundingRequests", label: "Funding Requests", icon: <Activity size={20} /> },
    { id: "fundingChecks", label: "Funding Checks", icon: <CheckCircle size={20} /> },
    { id: "launchRequests", label: "Launch Requests", icon: <Activity size={20} /> },
    { id: "postLaunch", label: "Post-Launch Followups", icon: <Activity size={20} /> },
    { id: "withdrawals", label: "Withdrawal Requests", icon: <Activity size={20} />, badge: withdrawalCount },
    { id: "gantt", label: "Gantt Chart", icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-[#0F172A] border-r border-slate-800 shadow-2xl flex flex-col z-50">
      
      {/* Header / Logo */}
      <div className="p-8 pb-6">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="flex flex-col items-start select-none">
            <span className="text-3xl font-black text-orange-500 tracking-tighter">Idea</span>
            <div className="bg-orange-500 px-2 py-0.5 rounded-md -mt-1 ml-4 shadow-lg shadow-orange-500/20">
              <span className="text-white text-lg font-black tracking-tighter">2Life</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs with Hidden Scrollbar */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 scrollbar-hide" 
           style={{ 
             msOverflowStyle: 'none', 
             scrollbarWidth: 'none',
             WebkitOverflowScrolling: 'touch' 
           }}>
        
        {/* CSS لإخفاء السكرول بار في المتصفحات المختلفة */}
        <style dangerouslySetInnerHTML={{__html: `
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}} />

        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">
          Main Menu
        </div>

        <ul className="space-y-1">
          {tabs.map(tab => (
            <li key={tab.id}>
              <button
                onClick={() => onTabChange(tab.id)}
                className={`group relative flex items-center w-full px-4 py-3.5 rounded-xl transition-all duration-300
                  ${activeTab === tab.id
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 translate-x-1"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                  }`}
              >
                <div className={`${activeTab === tab.id ? "text-white" : "text-slate-500 group-hover:text-orange-400"} transition-colors`}>
                  {tab.icon}
                </div>
                
                <span className="ml-3 text-[14px] font-semibold truncate flex-1 text-left">
                  {tab.label}
                </span>

                {tab.badge > 0 && (
                  <span className={`ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center
                    ${activeTab === tab.id ? "bg-white text-orange-600" : "bg-orange-500 text-white"}`}>
                    {tab.badge}
                  </span>
                )}

                {activeTab === tab.id && (
                  <ChevronRight size={14} className="ml-1 opacity-50" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User profile & logout */}
      <div className="p-4 mt-auto border-t border-slate-800 bg-[#0F172A]">
        <div className="bg-slate-800/40 p-3 rounded-2xl flex items-center justify-between border border-slate-700/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative shrink-0">
              {userData?.profile_image ? (
                <img
                  src={`http://127.0.0.1:8000${userData.profile_image}`}
                  alt={userData.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-600 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User size={20} className="text-white" />
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0F172A] rounded-full"></span>
            </div>
            
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-100 truncate">
                {userData?.name || "Admin User"}
              </span>
              <span className="text-[11px] text-slate-500 font-medium truncate uppercase tracking-tighter">
                {userData?.role || "Committee Member"}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2.5 hover:bg-red-500/10 hover:text-red-400 text-slate-500 rounded-xl transition-all duration-200 group"
            title="Logout"
          >
            <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;