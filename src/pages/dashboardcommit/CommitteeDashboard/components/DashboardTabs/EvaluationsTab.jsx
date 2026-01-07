// src/pages/dashboardcommit/CommitteeDashboard/components/DashboardTabs/EvaluationsTab.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const EvaluationsTab = ({ onViewGanttChart }) => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluationData, setEvaluationData] = useState({
    evaluation_score: "",
    description: "",
    strengths: "",
    weaknesses: "",
    recommendations: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCommitteeIdeas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('committee_token');
      
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/committee/ideas",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.ideas) {
        setIdeas(response.data.ideas);
      } else {
        setIdeas([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching committee ideas:", err);
      setError(err.response?.data?.message || "An error occurred while fetching data");
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitteeIdeas();
  }, []);

  // فتح نموذج التقييم
  const handleOpenEvaluation = (idea) => {
    console.log("Opening evaluation for idea:", idea);
    console.log("Idea ID:", idea.id || idea.idea_id);
    
    setSelectedIdea(idea);
    setEvaluationData({
      evaluation_score: idea.initial_evaluation_score || "",
      description: "",
      strengths: "",
      weaknesses: "",
      recommendations: ""
    });
    setShowEvaluationModal(true);
  };

  // إرسال التقييم
  const handleSubmitEvaluation = async () => {
    if (!selectedIdea) {
      alert("No idea selected");
      return;
    }

    // الحصول على ID الفكرة
    const ideaId = selectedIdea.id || selectedIdea.idea_id;
    
    if (!ideaId) {
      alert("Error: Idea does not have a valid ID");
      console.error("Idea has no ID:", selectedIdea);
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('committee_token');
      
      console.log("Sending evaluation for idea ID:", ideaId);
      console.log("Evaluation data:", evaluationData);

      const response = await axios.post(
        `http://localhost:8000/api/ideas/${ideaId}/evaluate`,
        {
          evaluation_score: parseInt(evaluationData.evaluation_score),
          description: evaluationData.description || "",
          strengths: evaluationData.strengths || "",
          weaknesses: evaluationData.weaknesses || "",
          recommendations: evaluationData.recommendations || ""
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        alert("✅ Evaluation submitted successfully!");
        setShowEvaluationModal(false);
        fetchCommitteeIdeas(); // تحديث القائمة
      }
    } catch (err) {
      console.error("Evaluation submission error:", err);
      
      if (err.response) {
        console.log("Error response:", err.response.data);
        alert(err.response.data.message || `Error: ${err.response.status}`);
      } else if (err.request) {
        alert("Cannot connect to server");
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-sm font-medium ";
    const config = {
      pending: "bg-orange-50 text-orange-600",
      approved: "bg-emerald-50 text-emerald-600",
      rejected: "bg-red-50 text-red-600",
      under_review: "bg-blue-50 text-blue-600",
      evaluated: "bg-purple-50 text-purple-600",
      needs_revision: "bg-amber-50 text-amber-600"
    };
    
    return base + (config[status] || "bg-gray-50 text-gray-600");
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-600"></div>
        <p className="text-gray-500 font-medium">Loading Evaluations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 font-bold">!</div>
          <h3 className="text-lg font-bold text-gray-900">Data Synchronization Failed</h3>
          <p className="text-gray-500 mt-2 max-w-sm">{error}</p>
          <button
            onClick={fetchCommitteeIdeas}
            className="mt-6 px-8 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-orange-600 transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Evaluations</h2>
          <p className="text-gray-500 text-sm mt-1">
            {ideas.length} projects awaiting assessment
          </p>
        </div>
      </div>

      {ideas.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 py-24 text-center">
          <h3 className="text-base font-medium text-gray-400">No Evaluations Pending</h3>
          <p className="text-gray-400 text-sm mt-2">All assigned projects have been evaluated</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <div 
              key={idea.idea_id || idea.id} 
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-orange-500 transition-all duration-300 flex flex-col h-[350px] shadow-sm hover:shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={getStatusBadge(idea.status)}>
                  {idea.status?.replace('_', ' ')}
                </span>
                <span className="text-gray-400 text-sm">
                  REF-{idea.idea_id || idea.id}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                {idea.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                {idea.description || "No project description provided for this proposal."}
              </p>

              {/* إظهار نتيجة التقييم إذا كانت موجودة */}
              {idea.initial_evaluation_score && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Previous Score</span>
                    <span className="text-lg font-bold text-gray-900">{idea.initial_evaluation_score}/100</span>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                {/* زر التقييم */}
                <button
                  onClick={() => handleOpenEvaluation(idea)}
                  className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-all"
                >
                  {idea.initial_evaluation_score ? "Re-evaluate" : "Evaluate"}
                </button>
                
                <span className="text-sm text-gray-400">
                  ID: {idea.idea_id || idea.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* نافذة التقييم */}
      {showEvaluationModal && selectedIdea && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* الهيدر */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Project Assessment</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedIdea.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  ID: {selectedIdea.idea_id || selectedIdea.id}
                </p>
              </div>
              <button 
                onClick={() => setShowEvaluationModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* محتوى النموذج */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-4">
                {/* حقل درجة التقييم */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantifiable Score (0-100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={evaluationData.evaluation_score}
                    onChange={(e) => setEvaluationData({
                      ...evaluationData,
                      evaluation_score: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="Enter numerical value"
                    required
                  />
                </div>

                {/* حقل الوصف */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Executive Summary
                  </label>
                  <textarea
                    value={evaluationData.description}
                    onChange={(e) => setEvaluationData({
                      ...evaluationData,
                      description: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm min-h-[80px]"
                    placeholder="Brief evaluation overview..."
                  />
                </div>

                {/* نقاط القوة والضعف */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-600 mb-2">
                      Core Strengths
                    </label>
                    <textarea
                      value={evaluationData.strengths}
                      onChange={(e) => setEvaluationData({
                        ...evaluationData,
                        strengths: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm min-h-[80px]"
                      placeholder="Key strengths of the project..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-red-600 mb-2">
                      Identified Weaknesses
                    </label>
                    <textarea
                      value={evaluationData.weaknesses}
                      onChange={(e) => setEvaluationData({
                        ...evaluationData,
                        weaknesses: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm min-h-[80px]"
                      placeholder="Areas needing improvement..."
                    />
                  </div>
                </div>

                {/* التوصيات */}
                <div>
                  <label className="block text-sm font-medium text-orange-600 mb-2">
                    Strategic Recommendations
                  </label>
                  <textarea
                    value={evaluationData.recommendations}
                    onChange={(e) => setEvaluationData({
                      ...evaluationData,
                      recommendations: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm min-h-[80px]"
                    placeholder="Recommendations for next steps..."
                  />
                </div>
              </div>
            </div>

            {/* أزرار التنفيذ */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowEvaluationModal(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEvaluation}
                disabled={submitting || !evaluationData.evaluation_score}
                className={`px-8 py-2 rounded-lg text-sm font-medium transition-all ${
                  submitting || !evaluationData.evaluation_score
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-orange-600"
                }`}
              >
                {submitting ? "Processing..." : "Submit Assessment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationsTab;