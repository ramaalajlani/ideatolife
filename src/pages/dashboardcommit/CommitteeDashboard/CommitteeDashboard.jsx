// src/pages/dashboardcommit/CommitteeDashboard/CommitteeDashboard.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// استيراد المكونات من نفس المجلد
import DashboardHeader from "./components/DashboardHeader/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar/DashboardSidebar";
import Notifications from "./components/Notifications/Notifications";
import DashboardTabs from "./components/DashboardTabs/DashboardTabs";

function CommitteeDashboard() {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  
  // States
  const [ideas, setIdeas] = useState([]);
  const [bmcs, setBmcs] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [fundingRequests, setFundingRequests] = useState([]);
  const [fundingChecks, setFundingChecks] = useState([]);
  const [committeeInfo, setCommitteeInfo] = useState({ 
    name: "Loading...", 
    role: "Committee Member" 
  });
  const [activeTab, setActiveTab] = useState("ideas");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalIdeas: 0,
    pendingEvaluations: 0,
    upcomingMeetings: 0,
    pendingBMCS: 0
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem('committee_token');
        
        if (!token) {
          navigate("/login");
          return;
        }

        // جلب بيانات المستخدم
        const userResponse = await axios.get(
          "http://localhost:8000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setUserData(userResponse.data);
        setCommitteeInfo({
          name: userResponse.data.name,
          role: userResponse.data.committee_role
        });

        // جلب جميع البيانات بالتوازي
        const [
          ideasResponse,
          evaluationsResponse,
          meetingsResponse,
          bmcsResponse, // ✅ تم التعديل هنا
          fundingRequestsResponse,
          fundingChecksResponse
        ] = await Promise.all([
          // الأفكار الموكلة
          axios.get("http://localhost:8000/api/ideas/assigned", {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: [] })),
          
          // التقييمات
          axios.get("http://localhost:8000/api/evaluations/pending", {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: [] })),
          
          // الاجتماعات القادمة
          axios.get("http://localhost:8000/api/committee/upcoming-meetings", {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: { upcoming_meetings: [] } })),
          
          // نماذج الأعمال - ✅ تم التعديل: /committee/bmcs بدلاً من /business-models/pending
          axios.get("http://localhost:8000/api/committee/bmcs", {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: { bmcs: [] } })),
          
          // طلبات التمويل
          axios.get("http://localhost:8000/api/funding-requests/pending", {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: [] })),
          
          // شيكات التمويل
          axios.get("http://localhost:8000/api/funding-checks/pending", {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: [] }))
        ]);

        // تحديث الحالة
        setIdeas(ideasResponse.data || []);
        setEvaluations(evaluationsResponse.data || []);
        // ✅ التعديل هنا: bmcsResponse.data.bmcs بدلاً من bmcsResponse.data
        setBmcs(bmcsResponse.data?.bmcs || []);
        setFundingRequests(fundingRequestsResponse.data || []);
        setFundingChecks(fundingChecksResponse.data || []);

        // تحديث الإحصائيات
        setStats({
          totalIdeas: ideasResponse.data?.length || 0,
          pendingEvaluations: evaluationsResponse.data?.length || 0,
          upcomingMeetings: meetingsResponse.data?.upcoming_meetings?.length || 0,
          pendingBMCS: bmcsResponse.data?.bmcs?.length || 0 // ✅ تم التعديل هنا
        });

      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem('committee_token');
          localStorage.removeItem('user_data');
          navigate("/login");
        }
        // استخدام بيانات وهمية للعرض فقط إذا فشل الAPI
        loadMockData();
      } finally {
        setLoading(false);
      }
    };

    const loadMockData = () => {
      setIdeas([
        { 
          id: 1, 
          title: "AI Time Management", 
          description: "Advanced mobile application using neural networks to optimize daily productivity.", 
          status: "pending",
          committee_name: "Technology Committee",
          created_at: "2024-01-15",
          owner_name: "Ahmed Ali"
        },
        { 
          id: 2, 
          title: "Eco-Tech Marketplace", 
          description: "E-commerce platform specialized in refurbished high-end sustainable technology.", 
          status: "approved",
          committee_name: "Sustainability Committee",
          created_at: "2024-01-10",
          owner_name: "Sarah Mohammed"
        },
        { 
          id: 3, 
          title: "Code Academy Pro", 
          description: "Next-gen educational platform for immersive programming and engineering learning.", 
          status: "under_review",
          committee_name: "Education Committee",
          created_at: "2024-01-05",
          owner_name: "Mohammed Hassan"
        }
      ]);
      
      setEvaluations([
        {
          id: 1,
          idea_title: "AI Time Management",
          evaluator_name: "Dr. Khalid",
          evaluation_date: "2024-01-20",
          score: 85,
          status: "pending"
        },
        {
          id: 2,
          idea_title: "Eco-Tech Marketplace",
          evaluator_name: "Prof. Layla",
          evaluation_date: "2024-01-18",
          score: 92,
          status: "completed"
        }
      ]);

      // ✅ تحديث هيكل بيانات الـ BMCs ليتطابق مع الـ API الجديد
      setBmcs([
        { 
          id: 1, 
          idea_id: 1,
          idea_title: "AI Time Management", 
          idea_description: "Initial Business Model Canvas for the AI project.",
          status: "pending",
          submitted_by: "Ahmed Ali",
          submission_date: "2024-01-16",
          // حقول BMC
          key_partners: "Tech Partners, AI Research Labs",
          key_activities: "AI Development, Mobile App Development",
          key_resources: "AI Engineers, Development Team",
          value_proposition: "AI-powered time management solution",
          customer_relationships: "Direct support, Online community",
          channels: "App Stores, Website",
          customer_segments: "Professionals, Students, Busy Individuals",
          cost_structure: "Development costs, Marketing, Salaries",
          revenue_streams: "Subscription model, In-app purchases"
        }
      ]);

      setFundingRequests([
        {
          id: 1,
          idea_title: "Eco-Tech Marketplace",
          amount: 50000,
          requested_by: "Sarah Mohammed",
          request_date: "2024-01-12",
          status: "pending"
        }
      ]);

      setFundingChecks([
        {
          id: 1,
          idea_title: "Code Academy Pro",
          funding_request_id: 1,
          checked_by: "Finance Dept",
          check_date: "2024-01-08",
          status: "approved"
        }
      ]);

      setStats({
        totalIdeas: 3,
        pendingEvaluations: 1,
        upcomingMeetings: 2,
        pendingBMCS: 1
      });
    };

    fetchAllData();
  }, [navigate]);

  const tabs = [
    { 
      id: "ideas", 
      label: "Assigned Ideas",
      badge: stats.totalIdeas
    },
    { 
      id: "evaluations", 
      label: "Evaluations",
      badge: stats.pendingEvaluations
    },
    { 
      id: "meetings", 
      label: "Meetings",
      badge: stats.upcomingMeetings
    },
    { 
      id: "bmcs", 
      label: "Business Models",
      badge: stats.pendingBMCS
    },
    { 
      id: "fundingRequests", 
      label: "Funding Requests",
      badge: fundingRequests.length
    },
    { 
      id: "fundingChecks", 
      label: "Funding Checks",
      badge: fundingChecks.length
    }
  ];

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ";
    const config = {
      pending: "bg-orange-50 text-orange-600 border-orange-100",
      approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
      rejected: "bg-red-50 text-red-600 border-red-100",
      under_review: "bg-blue-50 text-blue-600 border-blue-100",
      completed: "bg-green-50 text-green-600 border-green-100",
      draft: "bg-gray-50 text-gray-600 border-gray-100",
      needs_revision: "bg-blue-50 text-blue-600 border-blue-100" // ✅ إضافة
    };
    return base + (config[status] || "bg-gray-50 text-gray-600 border-gray-100");
  };

  const handleLogout = () => {
    localStorage.removeItem('committee_token');
    localStorage.removeItem('user_data');
    navigate("/login");
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefreshData = async () => {
    setLoading(true);
    // إعادة تحميل البيانات
    const token = localStorage.getItem('committee_token');
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // يمكنك هنا إعادة تحميل البيانات للتبويب النشط فقط لتحسين الأداء
      const currentTab = activeTab;
      let response;
      
      switch(currentTab) {
        case 'ideas':
          response = await axios.get("http://localhost:8000/api/ideas/assigned", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIdeas(response.data || []);
          break;
        case 'evaluations':
          response = await axios.get("http://localhost:8000/api/evaluations/pending", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setEvaluations(response.data || []);
          break;
        case 'meetings':
          // Meetings data will be refreshed by the MeetingsTab component
          break;
        case 'bmcs':
          // ✅ التعديل هنا
          response = await axios.get("http://localhost:8000/api/committee/bmcs", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setBmcs(response.data?.bmcs || []);
          break;
        case 'fundingRequests':
          response = await axios.get("http://localhost:8000/api/funding-requests/pending", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFundingRequests(response.data || []);
          break;
        case 'fundingChecks':
          response = await axios.get("http://localhost:8000/api/funding-checks/pending", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFundingChecks(response.data || []);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && activeTab === 'ideas') {
    return (
      <div className="flex h-screen bg-[#FAFAFA] font-sans antialiased text-slate-900" dir="ltr">
        <div className="m-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FAFAFA] font-sans antialiased text-slate-900" dir="ltr">
      
      {/* Sidebar */}
      <DashboardSidebar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userData={committeeInfo}
        onLogout={handleLogout}
        tabs={tabs}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <DashboardHeader 
          activeTab={activeTab}
          tabs={tabs}
          userName={committeeInfo.name}
          onTabChange={handleTabChange}
          onRefresh={handleRefreshData}
          isLoading={loading}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8 md:p-10">
          {ideaId && (
            <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-4">
              <span className="bg-orange-600 text-white text-[9px] font-black px-2 py-0.5 rounded">ID LOOKUP</span>
              <p className="text-orange-900 text-xs font-bold uppercase tracking-tight">
                Viewing Specific Record: <span className="underline font-black">REF-{ideaId}</span>
              </p>
            </div>
          )}

          {/* Notifications */}
          <Notifications 
            stats={stats}
            evaluationsCount={evaluations.filter(e => e.status === 'pending').length}
            meetingsCount={stats.upcomingMeetings}
          />

          {/* Dashboard Tabs */}
          <DashboardTabs 
            activeTab={activeTab}
            ideas={ideas}
            bmcs={bmcs}
            evaluations={evaluations}
            fundingRequests={fundingRequests}
            fundingChecks={fundingChecks}
            getStatusBadge={getStatusBadge}
            onRefresh={handleRefreshData}
            isLoading={loading}
            onViewGanttChart={(idea) => {
              // Navigate to Gantt chart or open modal
              console.log("View Gantt chart for:", idea);
              // يمكنك إضافة navigation هنا
            }}
          />
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-4 px-8">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-bold">
              COMMITTEE DASHBOARD v1.0 • SECURE CONNECTION ESTABLISHED
            </div>
            <div className="text-xs text-gray-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default CommitteeDashboard;