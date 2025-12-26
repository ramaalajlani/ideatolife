// src/pages/dashboardcommit/CommitteeDashboard/components/DashboardTabs/DashboardTabs.jsx
import React from "react";
import IdeasTab from "./IdeasTab";
import EvaluationsTab from "./EvaluationsTab";
import MeetingsTab from "./MeetingsTab";
import BMCsTab from "./BMCsTab";
import FundingRequestsTab from "./FundingRequestsTab";
import FundingChecksTab from "./FundingChecksTab";

const DashboardTabs = ({ activeTab }) => {
  // دالة عرض مخطط جانت
  const handleViewGanttChart = (idea) => {
    console.log("View Gantt Chart for idea:", idea);
    // هنا يمكنك إضافة التنقل إلى صفحة مخطط جانت
    // navigate(`/gantt-chart/${idea.id}`);
  };

  switch (activeTab) {
    case "ideas":
      return <IdeasTab onViewGanttChart={handleViewGanttChart} />;
    case "evaluations":
      return <EvaluationsTab onViewGanttChart={handleViewGanttChart} />;
    case "meetings":
      return <MeetingsTab />;
    case "bmcs":
      return <BMCsTab />;
    case "fundingRequests":
      return <FundingRequestsTab />;
    case "fundingChecks":
      return <FundingChecksTab />;
    default:
      return (
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[2rem]">
          <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-300 italic">Module Offline</h3>
          <p className="text-gray-400 text-[10px] mt-2 font-bold uppercase tracking-widest">Scheduled for Next Update</p>
        </div>
      );
  }
};

export default DashboardTabs;