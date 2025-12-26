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
    const base = "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ";
    const config = {
      pending: "bg-orange-50 text-orange-600 border-orange-100",
      approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
      rejected: "bg-red-50 text-red-600 border-red-100",
      under_review: "bg-blue-50 text-blue-600 border-blue-100",
      evaluated: "bg-purple-50 text-purple-600 border-purple-100",
      needs_revision: "bg-amber-50 text-amber-600 border-amber-100"
    };
    
    return base + (config[status] || "bg-gray-50 text-gray-600 border-gray-100");
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-600"></div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Loading Evaluations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 font-black">!</div>
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Data Synchronization Failed</h3>
          <p className="text-gray-500 text-sm mt-2 max-w-sm">{error}</p>
          <button
            onClick={fetchCommitteeIdeas}
            className="mt-6 px-8 py-2.5 bg-[#0F1115] text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-gray-900">Project Evaluations</h2>
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-[0.2em] font-bold">
            {ideas.length} projects awaiting assessment
          </p>
        </div>
      </div>

      {ideas.length === 0 ? (
        <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 py-24 text-center">
          <h3 className="text-sm font-black uppercase tracking-[0.4em] text-gray-300">No Evaluations Pending</h3>
          <p className="text-gray-400 text-[10px] mt-2 font-bold uppercase tracking-widest">All assigned projects have been evaluated</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {ideas.map((idea) => (
            <div 
              key={idea.idea_id || idea.id} 
              className="group bg-white rounded-2xl border border-gray-200 p-8 hover:border-orange-500 transition-all duration-300 flex flex-col h-[380px] shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-8">
                <span className={getStatusBadge(idea.status)}>
                  {idea.status?.replace('_', ' ')}
                </span>
                <span className="text-gray-300 text-[10px] font-black tracking-tighter italic">
                  REF-{idea.idea_id || idea.id}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors leading-snug">
                {idea.title}
              </h3>
              
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-4">
                {idea.description || "No project description provided for this proposal."}
              </p>

              {/* إظهار نتيجة التقييم إذا كانت موجودة */}
              {idea.initial_evaluation_score && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Previous Score</span>
                    <span className="text-lg font-black text-gray-900">{idea.initial_evaluation_score}/100</span>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                {/* زر التقييم */}
                <button
                  onClick={() => handleOpenEvaluation(idea)}
                  className="px-6 py-2.5 bg-[#0F1115] text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-orange-600 transition-all active:scale-95"
                >
                  {idea.initial_evaluation_score ? "Re-evaluate" : "Evaluate"}
                </button>
                
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                  ID: {idea.idea_id || idea.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* نافذة التقييم */}
      {showEvaluationModal && selectedIdea && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* الهيدر */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Project Assessment</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">
                  {selectedIdea.title}
                </p>
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">
                  ID: {selectedIdea.idea_id || selectedIdea.id}
                </p>
              </div>
              <button 
                onClick={() => setShowEvaluationModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors text-xl font-black"
              >
                &times;
              </button>
            </div>

            {/* محتوى النموذج */}
            <div className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* حقل درجة التقييم */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
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
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none font-bold text-sm"
                    placeholder="Enter numerical value"
                    required
                  />
                </div>

                {/* حقل الوصف */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                    Executive Summary
                  </label>
                  <textarea
                    value={evaluationData.description}
                    onChange={(e) => setEvaluationData({
                      ...evaluationData,
                      description: e.target.value
                    })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none text-sm min-h-[100px]"
                    placeholder="Brief evaluation overview..."
                  />
                </div>

                {/* نقاط القوة والضعف */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">
                      Core Strengths
                    </label>
                    <textarea
                      value={evaluationData.strengths}
                      onChange={(e) => setEvaluationData({
                        ...evaluationData,
                        strengths: e.target.value
                      })}
                      className="w-full px-4 py-3 bg-emerald-50/30 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm min-h-[80px]"
                      placeholder="Key strengths of the project..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-2">
                      Identified Weaknesses
                    </label>
                    <textarea
                      value={evaluationData.weaknesses}
                      onChange={(e) => setEvaluationData({
                        ...evaluationData,
                        weaknesses: e.target.value
                      })}
                      className="w-full px-4 py-3 bg-red-50/30 border-none rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none text-sm min-h-[80px]"
                      placeholder="Areas needing improvement..."
                    />
                  </div>
                </div>

                {/* التوصيات */}
                <div>
                  <label className="block text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-2">
                    Strategic Recommendations
                  </label>
                  <textarea
                    value={evaluationData.recommendations}
                    onChange={(e) => setEvaluationData({
                      ...evaluationData,
                      recommendations: e.target.value
                    })}
                    className="w-full px-4 py-3 bg-orange-50/30 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none text-sm min-h-[80px]"
                    placeholder="Recommendations for next steps..."
                  />
                </div>
              </div>
            </div>

            {/* أزرار التنفيذ */}
            <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
              <button
                onClick={() => setShowEvaluationModal(false)}
                className="px-8 py-3 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                disabled={submitting}
              >
                Discard
              </button>
              <button
                onClick={handleSubmitEvaluation}
                disabled={submitting || !evaluationData.evaluation_score}
                className={`px-10 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                  submitting || !evaluationData.evaluation_score
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#0F1115] text-white hover:bg-orange-600 shadow-xl shadow-orange-500/10 active:scale-95"
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