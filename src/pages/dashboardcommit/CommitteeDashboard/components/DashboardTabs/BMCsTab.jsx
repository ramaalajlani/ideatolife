import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  CheckCircle, 
  Eye, 
  Calendar, 
  FileText, 
  TrendingUp,
  Target,
  BarChart3,
  Users,
  X
} from "lucide-react";

const BMCsTab = () => {
  const [bmcs, setBmcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBMC, setSelectedBMC] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [evaluatingBMC, setEvaluatingBMC] = useState(null);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const [meetingBMC, setMeetingBMC] = useState(null);
  const [showMeeting, setShowMeeting] = useState(false);

  const [evaluationData, setEvaluationData] = useState({
    score: "",
    strengths: "",
    weaknesses: "",
    financial_analysis: "",
    risks: "",
    recommendation: "",
    comments: "",
  });

  const token = localStorage.getItem("committee_token");

  /* ================= FETCH ================= */
  const fetchCommitteeBMCs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/committee/bmcs", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      });
      setBmcs(res.data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching BMCs:", err);
      setError(err.response?.data?.message || "Failed to load business models");
      setBmcs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitteeBMCs();
  }, []);

  /* ================= SUBMIT EVALUATION ================= */
  const submitEvaluation = async () => {
    if (!evaluatingBMC) return;

    try {
      const payload = { 
        ...evaluationData, 
        score: evaluationData.score ? Number(evaluationData.score) : 0 
      };

      await axios.post(
        `http://localhost:8000/api/ideas/${evaluatingBMC.idea_id}/advanced-evaluation`,
        payload,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json" 
          } 
        }
      );

      alert("✅ Evaluation submitted successfully!");
      setShowEvaluation(false);
      setEvaluatingBMC(null);
      setEvaluationData({
        score: "",
        strengths: "",
        weaknesses: "",
        financial_analysis: "",
        risks: "",
        recommendation: "",
        comments: "",
      });

      fetchCommitteeBMCs();
    } catch (err) {
      console.error("Evaluation error:", err);
      alert(err.response?.data?.message || "❌ Failed to submit evaluation");
    }
  };

  /* ================= FETCH MEETING ================= */
  const fetchMeeting = async (ideaId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/ideas/${ideaId}/advanced-meeting`,
        {},
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json" 
          } 
        }
      );
      return res.data.meeting;
    } catch (err) {
      console.error("Meeting fetch error:", err);
      alert(err.response?.data?.message || "❌ Failed to fetch meeting details");
      return null;
    }
  };

  /* ================= UPDATE MEETING ================= */
  const updateMeeting = async (meeting) => {
    try {
      const payload = {
        meeting_date: meeting.meeting_date,
        meeting_link: meeting.meeting_link,
        notes: meeting.notes,
      };

      await axios.post(
        `http://localhost:8000/api/ideas/${meeting.idea_id}/advanced-meeting`,
        payload,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json" 
          } 
        }
      );

      alert("✅ Meeting updated successfully!");
      setShowMeeting(false);
      fetchCommitteeBMCs();
    } catch (err) {
      console.error("Meeting update error:", err);
      alert(err.response?.data?.message || "❌ Failed to update meeting");
    }
  };

  /* ================= STATUS STYLES ================= */
  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-sm font-medium ";
    const config = {
      approved: "bg-emerald-50 text-emerald-600",
      rejected: "bg-red-50 text-red-600",
      needs_revision: "bg-amber-50 text-amber-600",
      pending: "bg-orange-50 text-orange-600",
      evaluated: "bg-purple-50 text-purple-600",
      under_review: "bg-blue-50 text-blue-600"
    };
    
    return base + (config[status] || "bg-gray-50 text-gray-600");
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-600"></div>
        <p className="text-gray-500 font-medium">Loading Business Models...</p>
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
            onClick={fetchCommitteeBMCs}
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
          <h2 className="text-2xl font-bold text-gray-900">Business Model Evaluations</h2>
          <p className="text-gray-500 text-sm mt-1">
            {bmcs.length} business models awaiting advanced assessment
          </p>
        </div>
      </div>

      {bmcs.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 py-24 text-center">
          <h3 className="text-base font-medium text-gray-400">No Business Models Pending</h3>
          <p className="text-gray-400 text-sm mt-2">All business models have been evaluated</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {bmcs.map((bmc) => (
            <div 
              key={bmc.idea_id}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-orange-500 transition-all duration-300 flex flex-col h-[350px] shadow-sm hover:shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={getStatusBadge(bmc.business_plan?.status)}>
                  {bmc.business_plan?.status?.replace('_', ' ') || 'pending'}
                </span>
                <span className="text-gray-400 text-sm">
                  ID: {bmc.idea_id}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                {bmc.idea_title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                {bmc.idea_description || "No description provided for this business model."}
              </p>

              {/* Business Plan Info */}
              {bmc.business_plan && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>Business Plan Submitted</span>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedBMC(bmc);
                      setShowDetails(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                  >
                    <Eye size={14} /> View
                  </button>

                  <button
                    onClick={() => {
                      setEvaluatingBMC(bmc);
                      setShowEvaluation(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                  >
                    <CheckCircle size={14} /> Evaluate
                  </button>
                </div>
                
                <button
                  onClick={async () => {
                    const meeting = await fetchMeeting(bmc.idea_id);
                    setMeetingBMC(meeting);
                    setShowMeeting(true);
                  }}
                  className="p-2 text-gray-500 hover:text-orange-600 transition-colors"
                  title="Schedule Meeting"
                >
                  <Calendar size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= DETAILS MODAL ================= */}
      {showDetails && selectedBMC && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Business Model Details</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedBMC.idea_title}</p>
              </div>
              <button 
                onClick={() => setShowDetails(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedBMC.business_plan && Object.entries(selectedBMC.business_plan)
                  .filter(([_, value]) => typeof value === 'string' && value.trim())
                  .map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}
                      </h4>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 text-sm">{value}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MEETING MODAL ================= */}
      {showMeeting && meetingBMC && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Meeting Details</h3>
                <p className="text-sm text-gray-500 mt-1">Schedule or update meeting</p>
              </div>
              <button 
                onClick={() => setShowMeeting(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  value={meetingBMC.meeting_date ? new Date(meetingBMC.meeting_date).toISOString().slice(0,16) : ""}
                  onChange={(e) =>
                    setMeetingBMC({ ...meetingBMC, meeting_date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="https://meet.google.com/..."
                  value={meetingBMC.meeting_link || ""}
                  onChange={(e) =>
                    setMeetingBMC({ ...meetingBMC, meeting_link: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none min-h-[100px]"
                  placeholder="Meeting agenda, discussion points, etc."
                  value={meetingBMC.notes || ""}
                  onChange={(e) =>
                    setMeetingBMC({ ...meetingBMC, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowMeeting(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => updateMeeting(meetingBMC)}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EVALUATION MODAL ================= */}
      {showEvaluation && evaluatingBMC && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Advanced Business Model Evaluation</h3>
                <p className="text-sm text-gray-500 mt-1">{evaluatingBMC.idea_title}</p>
              </div>
              <button 
                onClick={() => setShowEvaluation(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="Enter score from 0 to 100"
                  value={evaluationData.score}
                  onChange={(e) =>
                    setEvaluationData({ ...evaluationData, score: e.target.value })
                  }
                />
              </div>

              {[
                { key: "strengths", label: "Key Strengths", icon: TrendingUp },
                { key: "weaknesses", label: "Identified Weaknesses", icon: Target },
                { key: "financial_analysis", label: "Financial Analysis", icon: BarChart3 },
                { key: "risks", label: "Risk Assessment", icon: Users },
                { key: "recommendation", label: "Recommendations", icon: CheckCircle },
                { key: "comments", label: "Additional Comments", icon: FileText }
              ].map(({ key, label, icon: Icon }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    {Icon && <Icon size={14} />}
                    {label}
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none min-h-[80px]"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                    value={evaluationData[key]}
                    onChange={(e) =>
                      setEvaluationData({ ...evaluationData, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowEvaluation(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={submitEvaluation}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all"
              >
                Submit Evaluation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BMCsTab;