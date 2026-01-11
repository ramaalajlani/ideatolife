import React, { useState, useEffect } from "react";
import axios from "axios";

const IdeasTab = ({ onViewGanttChart }) => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [profitData, setProfitData] = useState(null);
  const [showProfitDistribution, setShowProfitDistribution] = useState(false);
  const [loadingProfit, setLoadingProfit] = useState(false);
  const [profitError, setProfitError] = useState(null);

  const fetchCommitteeIdeas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("committee_token");

      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/committee/ideas-full-clean",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.ideas) {
        setIdeas(response.data.ideas);
      } else {
        setIdeas([]);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching committee ideas:", err);
      setError(err.response?.data?.message || "Failed to load ideas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitteeIdeas();
  }, []);

  const fetchProfitDistribution = async (ideaId) => {
    try {
      setLoadingProfit(true);
      setProfitError(null);
      const token = localStorage.getItem("committee_token");

      if (!token) {
        setProfitError("Authentication required. Please log in.");
        return;
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/ideas/${ideaId}/profit-distribution-summary/comittee/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProfitData(response.data);
      setShowProfitDistribution(true);
    } catch (err) {
      console.error("Error fetching profit distribution:", err);
      setProfitError(err.response?.data?.message || "Failed to load profit distribution");
    } finally {
      setLoadingProfit(false);
    }
  };

  const handleViewProfit = (idea) => {
    setSelectedIdea(idea);
    fetchProfitDistribution(idea.id);
  };

  const handleIdeaClick = (idea) => {
    setSelectedIdea(idea);
    setShowDetails(true);
  };

  const toggleRowExpansion = (ideaId) => {
    setExpandedRows(prev => 
      prev.includes(ideaId) 
        ? prev.filter(id => id !== ideaId)
        : [...prev, ideaId]
    );
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      approved: "bg-green-100 text-green-800 border border-green-200",
      rejected: "bg-red-100 text-red-800 border border-red-200",
      "in_progress": "bg-blue-100 text-blue-800 border border-blue-200",
      "under_review": "bg-purple-100 text-purple-800 border border-purple-200",
      "completed": "bg-emerald-100 text-emerald-800 border border-emerald-200",
    };
    return config[status] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const getStageBadge = (stage) => {
    const config = {
      "idea_conception": "bg-indigo-50 text-indigo-700 border border-indigo-200",
      "market_research": "bg-blue-50 text-blue-700 border border-blue-200",
      "prototype_development": "bg-cyan-50 text-cyan-700 border border-cyan-200",
      "testing_phase": "bg-amber-50 text-amber-700 border border-amber-200",
      "launch_preparation": "bg-orange-50 text-orange-700 border border-orange-200",
      "post_launch": "bg-emerald-50 text-emerald-700 border border-emerald-200",
      "execution_and_development": "bg-teal-50 text-teal-700 border border-teal-200",
    };
    return config[stage] || "bg-gray-50 text-gray-700 border border-gray-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const ProgressBar = ({ percentage }) => (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            percentage >= 70 ? "bg-green-500" :
            percentage >= 40 ? "bg-yellow-500" : "bg-red-500"
          }`}
          style={{ width: `${percentage || 0}%` }}
        ></div>
      </div>
      <span className="text-sm font-bold text-gray-700 min-w-[35px] text-right">
        {percentage || 0}%
      </span>
    </div>
  );

  const ProfitDistributionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Profit Distribution</h2>
            <p className="text-gray-600">Details for idea: {profitData?.idea_title}</p>
          </div>
          <button
            onClick={() => setShowProfitDistribution(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            ✕
          </button>
        </div>

        {loadingProfit ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading profit distribution...</p>
          </div>
        ) : profitError ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-bold">{profitError}</p>
            <button
              onClick={() => fetchProfitDistribution(selectedIdea.id)}
              className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : profitData ? (
          <div className="p-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white text-sm font-medium">Idea ID: {profitData.idea_id}</div>
                  <h3 className="text-2xl font-black text-white mt-2">{profitData.idea_title}</h3>
                </div>
                <div className="bg-white/20 px-4 py-3 rounded-xl">
                  <div className="text-white text-sm font-medium">Distribution Status</div>
                  <div className={`text-lg font-black ${profitData.profit_distributed ? 'text-green-200' : 'text-yellow-200'}`}>
                    {profitData.profit_distributed ? '✓ DISTRIBUTED' : 'PENDING'}
                  </div>
                </div>
              </div>
            </div>

       

            {/* Distribution Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Distribution Details</h3>
                <p className="text-sm text-gray-600">Breakdown of profit distribution among stakeholders</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-6 text-xs font-bold text-gray-600 uppercase">User</th>
                      <th className="text-left py-3 px-6 text-xs font-bold text-gray-600 uppercase">Role</th>
                      <th className="text-left py-3 px-6 text-xs font-bold text-gray-600 uppercase">Percentage</th>
                      <th className="text-left py-3 px-6 text-xs font-bold text-gray-600 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profitData.distributions?.map((dist, index) => (
                      <tr 
                        key={index} 
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          dist.role === 'committee' ? 'bg-orange-50 hover:bg-orange-100' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                              {dist.user_name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{dist.user_name}</div>
                              <div className="text-xs text-gray-500">{dist.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                            dist.role === 'idea_owner' ? 'bg-blue-100 text-blue-800' :
                            dist.role === 'investor' ? 'bg-purple-100 text-purple-800' :
                            dist.role === 'admin' ? 'bg-red-100 text-red-800' :
                            dist.role === 'committee' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {dist.role?.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-lg font-black text-gray-900">{dist.percentage}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-lg font-bold text-green-600">{dist.amount}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

         
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowProfitDistribution(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] space-y-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600"></div>
        <p className="text-gray-500 text-sm font-bold uppercase tracking-wide">
          LOADING IDEAS DATABASE
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-red-600 font-bold text-lg">{error}</p>
        <button
          onClick={fetchCommitteeIdeas}
          className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  if (showDetails && selectedIdea) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDetails(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Idea Details</h1>
              <p className="text-gray-600">Viewing details for selected idea</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleViewProfit(selectedIdea)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              View Profit Distribution
            </button>

            <button
              onClick={() => setShowDetails(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${getStatusBadge(selectedIdea.status)}`}>
                    {selectedIdea.status?.replace(/_/g, " ").toUpperCase()}
                  </span>
                  <span className="text-white text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                    ID: {selectedIdea.id}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white">{selectedIdea.title}</h2>
                <p className="text-orange-100 text-sm">{selectedIdea.description}</p>
              </div>
              <div className="text-right">
                <div className="text-white text-sm font-medium">Created</div>
                <div className="text-white font-bold">{formatDate(selectedIdea.created_at)}</div>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {selectedIdea.owner?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase">Owner</div>
                    <div className="font-bold text-gray-900">{selectedIdea.owner?.name || "Unknown"}</div>
                    <div className="text-sm text-gray-600 truncate">{selectedIdea.owner?.email || "No email"}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">Phone</div>
                    <div className="text-sm text-gray-900">{selectedIdea.owner?.phone || "Not provided"}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">Location</div>
                    <div className="text-sm text-gray-900">{selectedIdea.owner?.location || "Not specified"}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-gray-500 uppercase">Progress</div>
                  <div className="text-lg font-black text-orange-600">
                    {selectedIdea.roadmap?.progress_percentage || 0}%
                  </div>
                </div>
                <ProgressBar percentage={selectedIdea.roadmap?.progress_percentage || 0} />
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">Current Stage</div>
                    <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${getStageBadge(selectedIdea.roadmap?.current_stage)}`}>
                      {selectedIdea.roadmap?.current_stage?.replace(/_/g, " ") || "NOT SET"}
                    </span>
                  </div>
                  {selectedIdea.roadmap?.stage_description && (
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">Stage Description</div>
                      <p className="text-sm text-gray-700">{selectedIdea.roadmap.stage_description}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-sm font-bold text-gray-500 uppercase">Timeline</div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Created</div>
                    <div className="text-sm font-medium text-gray-900">{formatDate(selectedIdea.created_at)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Last Updated</div>
                    <div className="text-sm font-medium text-gray-900">{formatDate(selectedIdea.updated_at)}</div>
                  </div>
                  {selectedIdea.roadmap?.estimated_completion && (
                    <div>
                      <div className="text-xs text-gray-500">Estimated Completion</div>
                      <div className="text-sm font-medium text-gray-900">{formatDate(selectedIdea.roadmap.estimated_completion)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-sm font-bold text-gray-500 uppercase">Problem Statement</div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{selectedIdea.problem || "No problem statement provided."}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-sm font-bold text-gray-500 uppercase">Solution</div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{selectedIdea.solution || "No solution provided."}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-sm font-bold text-gray-500 uppercase">Target Audience</div>
                  </div>
                  <p className="text-gray-700">{selectedIdea.target_audience || "Not specified"}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-sm font-bold text-gray-500 uppercase">Additional Notes</div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{selectedIdea.additional_notes || "No additional notes."}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-sm font-bold text-gray-500 uppercase">Key Metrics</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black text-gray-900">{selectedIdea.roadmap?.progress_percentage || 0}%</div>
                    <div className="text-xs text-gray-500">Completion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-gray-900">
                      {selectedIdea.roadmap?.current_stage?.replace(/_/g, " ") || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">Current Stage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-gray-900">
                      {selectedIdea.status?.replace(/_/g, " ") || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">Status</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-gray-900">
                      {formatDate(selectedIdea.created_at)}
                    </div>
                    <div className="text-xs text-gray-500">Created</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleViewProfit(selectedIdea)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
                >
                  View Profit Distribution
                </button>
     
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showProfitDistribution && <ProfitDistributionModal />}
      
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Assigned Ideas</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-600">
                Total: <span className="font-bold text-orange-600">{ideas.length}</span> ideas
              </span>
            </div>
          </div>
        </div>
      </div>

      {ideas.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <div className="text-5xl mb-4">💡</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Ideas Assigned</h3>
          <p className="text-gray-600 mb-6">You don't have any ideas assigned to you yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="col-span-1">
              <span className="text-xs font-bold text-gray-600 uppercase">ID</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-bold text-gray-600 uppercase">Title</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-bold text-gray-600 uppercase">Owner</span>
            </div>
            <div className="col-span-1">
              <span className="text-xs font-bold text-gray-600 uppercase">Status</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-bold text-gray-600 uppercase">Stage</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-bold text-gray-600 uppercase">Progress</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-bold text-gray-600 uppercase">Actions</span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {ideas.map((idea) => (
              <div key={idea.id}>
                <div className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="col-span-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                      {idea.id}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{idea.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{idea.description}</p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900 text-sm">{idea.owner?.name || "Unknown"}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[150px]">
                        {idea.owner?.email || "No email"}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${getStatusBadge(idea.status)}`}>
                      {idea.status?.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${getStageBadge(idea.roadmap?.current_stage)}`}>
                        {idea.roadmap?.current_stage?.replace(/_/g, " ") || "NOT SET"}
                      </span>
                      {idea.roadmap?.stage_description && (
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {idea.roadmap.stage_description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="space-y-2">
                      <ProgressBar percentage={idea.roadmap?.progress_percentage || 0} />
                      <div className="text-xs text-gray-600">
                        {idea.roadmap?.current_stage?.replace(/_/g, " ") || "No stage"}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleIdeaClick(idea)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-xs"
                      >
                        Details
                      </button>
           
                      <button
                        onClick={() => handleViewProfit(idea)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors text-xs"
                      >
                        Profits
                      </button>
                    </div>
                  </div>
                </div>

                {expandedRows.includes(idea.id) && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-2">Problem</div>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                          {idea.problem || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-2">Solution</div>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                          {idea.solution || "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-4">
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-2">Target Audience</div>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                          {idea.target_audience || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-2">Additional Notes</div>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                          {idea.additional_notes || "No additional notes"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">Created</div>
                        <div className="text-sm font-medium text-gray-900">{formatDate(idea.created_at)}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">Updated</div>
                        <div className="text-sm font-medium text-gray-900">{formatDate(idea.updated_at)}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">Progress</div>
                        <div className="text-sm font-bold text-orange-600">{idea.roadmap?.progress_percentage || 0}%</div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleViewProfit(idea)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors text-sm"
                      >
                        View Profit Distribution
                      </button>
         
                    </div>
                  </div>
                )}

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
                  <button
                    onClick={() => toggleRowExpansion(idea.id)}
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    {expandedRows.includes(idea.id) ? "Show Less" : "Show More Details"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing <span className="font-bold">{ideas.length}</span> ideas
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-bold">{ideas.filter(i => i.status === "in_progress").length}</span> in progress
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-bold">{ideas.filter(i => i.status === "pending").length}</span> pending
                </div>
                <div className="text-sm text-gray-600">
                  Avg progress: <span className="font-bold text-orange-600">
                    {Math.round(
                      ideas.reduce((acc, idea) => acc + (idea.roadmap?.progress_percentage || 0), 0) / 
                      (ideas.length || 1)
                    )}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {ideas.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-xs font-bold text-gray-500 uppercase">Total</div>
            <div className="text-xl font-black text-gray-900">{ideas.length}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-xs font-bold text-gray-500 uppercase">In Progress</div>
            <div className="text-xl font-black text-blue-600">
              {ideas.filter(i => i.status === "in_progress").length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-xs font-bold text-gray-500 uppercase">Avg Progress</div>
            <div className="text-xl font-black text-orange-600">
              {Math.round(
                ideas.reduce((acc, idea) => acc + (idea.roadmap?.progress_percentage || 0), 0) / 
                (ideas.length || 1)
              )}%
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-xs font-bold text-gray-500 uppercase">Pending</div>
            <div className="text-xl font-black text-yellow-600">
              {ideas.filter(i => i.status === "pending").length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeasTab;