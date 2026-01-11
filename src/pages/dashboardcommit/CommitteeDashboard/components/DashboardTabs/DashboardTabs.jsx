// src/pages/dashboardcommit/CommitteeDashboard/components/DashboardTabs/DashboardTabs.jsx
import React from "react";
import IdeasTab from "./IdeasTab";
import EvaluationsTab from "./EvaluationsTab";
import MeetingsTab from "./MeetingsTab";
import BMCsTab from "./BMCsTab";
import FundingRequestsTab from "./FundingRequestsTab";
import FundingChecksTab from "./FundingChecksTab";
import GanttChartTabs from "./GanttChartTabs";
import LaunchRequestsTab from "./LaunchRequestsTab";
import PostLaunchFollowupsTab from "./PostLaunchFollowupsTab";
import WithdrawalRequestsTab from "./WithdrawalRequests";

const DashboardTabs = ({
  activeTab,
  ideas = [],
  bmcs = [],
  evaluations = [],
  fundingRequests = [],
  fundingChecks = [],
  launchRequests = [],
  postLaunchFollowups = [],
  withdrawalRequests = [],
  getStatusBadge,
  onViewGanttChart,
  onViewProfitDistribution, // ✅ أضفت هذا البروب
  onRefresh,
  isLoading = false,
  selectedIdeaId,
  committeeInfo, // ✅ أضفت هذا البروب
}) => {
  switch (activeTab) {
    case "ideas":
      return (
        <IdeasTab 
          ideas={ideas} 
          onViewGanttChart={onViewGanttChart}
          onViewProfitDistribution={onViewProfitDistribution} // ✅ تمريرها هنا
          committeeInfo={committeeInfo} // ✅ أضف هذا السطر
        />
      );

    case "evaluations":
      return <EvaluationsTab evaluations={evaluations} />;

    case "meetings":
      return <MeetingsTab />;

    case "bmcs":
      return <BMCsTab bmcs={bmcs} />;

    case "profitDistribution":
      return (
        <ProfitDistributionTab 
          ideaId={selectedIdeaId} 
          ideas={ideas} 
          committeeInfo={committeeInfo} // ✅ تمرير committeeInfo هنا
          onRefresh={onRefresh}
        />
      );

    case "fundingRequests":
      return (
        <FundingRequestsTab
          fundingRequests={fundingRequests}
          getStatusBadge={getStatusBadge}
          refreshData={onRefresh}
          isLoading={isLoading}
        />
      );

    case "fundingChecks":
      return <FundingChecksTab fundingChecks={fundingChecks} />;

    case "launchRequests":
      return (
        <LaunchRequestsTab
          launchRequests={launchRequests}
          isLoading={isLoading}
          refreshData={onRefresh}
        />
      );

    case "postLaunch":
      return (
        <PostLaunchFollowupsTab
          followups={postLaunchFollowups}
          isLoading={isLoading}
          refreshData={onRefresh}
        />
      );

    case "withdrawals":
      return (
        <WithdrawalRequestsTab
          withdrawalRequests={withdrawalRequests}
          isLoading={isLoading}
          refreshData={onRefresh}
        />
      );

    case "gantt":
      return <GanttChartTabs ideaId={selectedIdeaId} />;

    default:
      return (
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[2rem]">
          <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-300 italic">
            Module Offline
          </h3>
          <p className="text-gray-400 text-[10px] mt-2 font-bold uppercase tracking-widest">
            Scheduled for Next Update
          </p>
        </div>
      );
  }
};

export default DashboardTabs;