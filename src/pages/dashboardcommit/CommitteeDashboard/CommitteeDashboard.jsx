// src/pages/dashboardcommit/CommitteeDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// مكونات لوحة التحكم
import DashboardHeader from "./components/DashboardHeader/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar/DashboardSidebar";
import DashboardTabs from "./components/DashboardTabs/DashboardTabs";

function CommitteeDashboard() {
  const navigate = useNavigate();

  // البيانات
  const [bmcs, setBmcs] = useState([]);
  const [fundingRequests, setFundingRequests] = useState([]);
  const [fundingChecks, setFundingChecks] = useState([]);
  const [launchRequests, setLaunchRequests] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]); // ✨ جديد: طلبات الانسحاب
  const [committeeInfo, setCommitteeInfo] = useState({
    name: "Loading...",
    role: "Committee Member"
  });

  const [activeTab, setActiveTab] = useState("bmcs");
  const [loading, setLoading] = useState(true);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);

  // إحصائيات صغيرة لعرض badge
  const [stats, setStats] = useState({
    upcomingMeetings: 0,
    pendingBMCS: 0,
    fundingRequestsCount: 0,
    fundingChecksCount: 0,
    pendingLaunchRequests: 0,
    pendingWithdrawals: 0 // ✨ جديد
  });

  // جلب كل البيانات دفعة واحدة
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("committee_token");
      if (!token) {
        navigate("/login");
        return;
      }

      // بيانات المستخدم
      const userResponse = await axios.get(
        "http://127.0.0.1:8000/api/profile_member",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const userData = userResponse.data.committee_member;
      setCommitteeInfo({
        name: userData.name,
        role: userData.committee_role
      });

      // جلب البيانات المتعددة
      const [
        bmcsResponse,
        fundingRequestsResponse,
        fundingChecksResponse,
        launchRequestsResponse,
        withdrawalRequestsResponse, // ✨ جديد
        meetingsResponse
      ] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/committee/bmcs", { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { bmcs: [] } })),
        axios.get("http://127.0.0.1:8000/api/committee/fundings", { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { funding_requests: [] } })),
        axios.get("http://127.0.0.1:8000/api/committee/funding-checks", { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { checks: [] } })),
        axios.get("http://127.0.0.1:8000/api/launch-requests/pending", { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { pending_launch_requests: [] } })),
        axios.get("http://127.0.0.1:8000/api/committee/withdrawal-requests", { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { requests: [] } })), // ✨ جديد
        axios.get("http://127.0.0.1:8000/api/committee/upcoming-meetings", { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { upcoming_meetings: [] } }))
      ]);

      setBmcs(bmcsResponse.data?.bmcs || []);
      setFundingRequests(fundingRequestsResponse.data?.funding_requests || []);
      setFundingChecks(fundingChecksResponse.data?.checks || []);
      setLaunchRequests(launchRequestsResponse.data?.pending_launch_requests || []);
      setWithdrawalRequests(withdrawalRequestsResponse.data?.requests || []); // ✨ جديد: إصلاح المفتاح

      setStats({
        upcomingMeetings: meetingsResponse.data?.upcoming_meetings?.length || 0,
        pendingBMCS: bmcsResponse.data?.bmcs?.length || 0,
        fundingRequestsCount: fundingRequestsResponse.data?.funding_requests?.length || 0,
        fundingChecksCount: fundingChecksResponse.data?.checks?.length || 0,
        pendingLaunchRequests: launchRequestsResponse.data?.pending_launch_requests?.length || 0,
        pendingWithdrawals: withdrawalRequestsResponse.data?.total_requests || 0 // ✨ جديد
      });

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("committee_token");
    navigate("/login");
  };

  // فتح Gantt عند اختيار فكرة
  const handleViewGanttChart = (idea) => {
    setSelectedIdeaId(idea.id);
    setActiveTab("gantt");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabs = [
    { id: "bmcs", label: "Business Models", badge: stats.pendingBMCS },
    { id: "fundingRequests", label: "Funding Requests", badge: stats.fundingRequestsCount },
    { id: "fundingChecks", label: "Funding Checks", badge: stats.fundingChecksCount },
    { id: "launchRequests", label: "Launch Requests", badge: stats.pendingLaunchRequests },
    { id: "withdrawals", label: "Withdrawal Requests", badge: stats.pendingWithdrawals }, // ✨ جديد
    { id: "gantt", label: "Gantt Chart" }
  ];

  return (
    <div className="flex h-screen bg-[#FAFAFA] font-sans antialiased text-slate-900">
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userData={committeeInfo}
        onLogout={handleLogout}
        tabs={tabs}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          activeTab={activeTab}
          tabs={tabs}
          userName={committeeInfo.name}
          onTabChange={handleTabChange}
        />

        <main className="flex-1 overflow-auto p-8 md:p-10">
          <DashboardTabs
            activeTab={activeTab}
            bmcs={bmcs}
            fundingRequests={fundingRequests}
            fundingChecks={fundingChecks}
            launchRequests={launchRequests} // ← بيانات طلبات الإطلاق
            withdrawalRequests={withdrawalRequests} // ✨ جديد: تمرير بيانات طلبات الانسحاب
            selectedIdeaId={selectedIdeaId}
            onRefresh={fetchAllData}
            isLoading={loading}
            onViewGanttChart={handleViewGanttChart}
          />
        </main>
      </div>
    </div>
  );
}

export default CommitteeDashboard;
