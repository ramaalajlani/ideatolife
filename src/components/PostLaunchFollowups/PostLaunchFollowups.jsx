import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FollowupCard from "./components/FollowupCard";
import postLaunchFollowupService from "../../services/postLaunchFollowupService";

const PostLaunchFollowups = () => {
  const { ideaId } = useParams();
  const [loading, setLoading] = useState(true);
  const [followups, setFollowups] = useState([]);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [acknowledging, setAcknowledging] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [ownerResponse, setOwnerResponse] = useState("");
  const [token, setToken] = useState(""); // إضافة حالة للتوكين

  // الحصول على التوكن عند تحميل المكون
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchFollowups = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await postLaunchFollowupService.getFollowupsByIdeaId(ideaId);
        setFollowups(data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (ideaId) fetchFollowups();
  }, [ideaId]);

  const handleInputChange = (index, field, value) => {
    const newFollowups = [...followups];
    newFollowups[index].followup[field] = value;
    setFollowups(newFollowups);
  };

  const handleUpdate = async (followupId, index) => {
    const followupData = {
      active_users: followups[index].followup.active_users,
      revenue: followups[index].followup.revenue,
      growth_rate: followups[index].followup.growth_rate,
    };

    if (!followupData.active_users || !followupData.revenue || !followupData.growth_rate) {
      alert("Please fill all required fields: Active Users, Revenue, and Growth Rate");
      return;
    }

    setUpdating(true);
    try {
      const result = await postLaunchFollowupService.updateFollowupByOwner(followupId, followupData);
      alert(result.message);
      
      const newFollowups = [...followups];
      newFollowups[index].followup.status = "pending_review";
      setFollowups(newFollowups);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleAcknowledge = async (followupId, index) => {
    if (!ownerResponse.trim()) {
      alert("Please enter a response to the committee feedback");
      return;
    }

    setAcknowledging(true);
    try {
      const data = {
        owner_response: ownerResponse,
        owner_acknowledged: true
      };
      
      const result = await postLaunchFollowupService.acknowledgePostLaunchFollowup(followupId, data);
      alert(result.message || "Response sent successfully");
      
      const newFollowups = [...followups];
      if (newFollowups[index] && newFollowups[index].followup) {
        newFollowups[index].followup.owner_acknowledged = true;
        newFollowups[index].followup.owner_response = ownerResponse;
      }
      setFollowups(newFollowups);
      setOwnerResponse("");
      
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send response");
    } finally {
      setAcknowledging(false);
    }
  };

  const filteredFollowups = followups.filter((item) => {
    const f = item.followup;
    
    if (activeTab === "committee") {
      return f.committee_decision && f.committee_decision !== "";
    } else if (activeTab === "owner") {
      return f.status === "pending" || 
             (f.committee_decision && !f.owner_acknowledged);
    } else if (activeTab === "completed") {
      return f.status === "done";
    } else if (activeTab === "graduate") {
      return f.committee_decision === "graduate";
    }
    return true;
  });

  const stats = {
    total: followups.length,
    pending: followups.filter(f => f.followup.status === "pending").length,
    completed: followups.filter(f => f.followup.status === "done").length,
    graduated: followups.filter(f => f.followup.committee_decision === "graduate").length,
    needsResponse: followups.filter(f => f.followup.committee_decision && !f.followup.owner_acknowledged).length,
  };

  // إذا لم يكن هناك توكن
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-bold text-red-800 mb-2">Authentication Error</h3>
          <p className="text-red-600">Please login again to access this feature.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Follow-ups...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-sans text-left">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (followups.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-sans text-left">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md w-full text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Follow-ups Found</h3>
          <p className="text-gray-600">No follow-up records have been created for this idea yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-8 font-sans text-left" dir="ltr">
      <div className="max-w-7xl mx-auto">
        
   {/* Header and Stats */}
<div className="mb-10">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-[#FFD586] rounded-xl p-6 border border-orange-300/50 shadow-sm">
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Post-Launch Follow-ups</h1>
      <p className="text-gray-700 mt-1">Monitor and update progress data for your launched project.</p>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-300/50">
        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total</div>
        <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
      </div>
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-300/50">
        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Pending</div>
        <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
      </div>
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-300/50">
        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Completed</div>
        <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
      </div>
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-300/50">
        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Graduated</div>
        <div className="text-2xl font-bold text-purple-700">{stats.graduated}</div>
      </div>
    </div>
  </div>
  
  {/* تم إزالة قسم Time Filter بالكامل */}
</div>
        {/* Tab Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-1 bg-gradient-to-r from-slate-50 to-gray-100 p-1 rounded-xl w-max md:w-full border border-gray-200/30">
            {[
              { id: "all", label: "All Records", count: stats.total },
              { id: "owner", label: "My Actions", count: stats.pending + stats.needsResponse },
              { id: "committee", label: "Committee Decisions", count: followups.filter(f => f.followup.committee_decision).length },
              { id: "completed", label: "Completed", count: stats.completed },
              { id: "graduate", label: "Graduated", count: stats.graduated }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                  activeTab === tab.id 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-md text-xs ${activeTab === tab.id ? "bg-blue-100 text-blue-700" : "bg-gray-200/50 text-gray-600"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {filteredFollowups.length === 0 ? (
            <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
              <h3 className="text-lg font-bold text-gray-500">No records to display in this category.</h3>
            </div>
          ) : (
            filteredFollowups.map((item, index) => (
              <FollowupCard 
                key={item.followup.id}
                item={item}
                index={index}
                handleInputChange={handleInputChange}
                handleUpdate={handleUpdate}
                handleAcknowledge={handleAcknowledge}
                updating={updating}
                acknowledging={acknowledging}
                ownerResponse={ownerResponse}
                setOwnerResponse={setOwnerResponse}
                token={token} // تمرير التوكن هنا
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostLaunchFollowups;