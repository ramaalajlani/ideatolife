// src/pages/dashboardcommit/CommitteeDashboard/components/DashboardTabs/GanttChartTabs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Calendar, 
  CheckCircle, 
  FileText, 
  BarChart, 
  Clock, 
  Download,
  Check,
  X,
  AlertTriangle,
  Users
} from "lucide-react";

// Phase Evaluation Modal
const PhaseEvaluationModal = ({ gantt, onClose, onSubmit, submitting }) => {
  const [score, setScore] = useState("");
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (score === "" || isNaN(score) || score < 0 || score > 100) {
      setError("Score must be between 0 and 100");
      return;
    }
    setError("");
    onSubmit({ score: parseInt(score), comments: comments.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Phase Evaluation</h3>
          <p className="text-sm text-gray-500 mt-1">{gantt.phase_name}</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Score (0-100)
            </label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Enter score"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Add evaluation comments..."
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-all"
          >
            {submitting ? "Saving..." : "Save Evaluation"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Bulk Approval Modal
const BulkApprovalModal = ({ idea, onClose, onSubmit, submitting }) => {
  const [approvalStatus, setApprovalStatus] = useState("approved");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for your decision");
      return;
    }
    setError("");
    onSubmit({ approval_status: approvalStatus, reason: reason.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Approve/Reject All Phases</h3>
          <p className="text-sm text-gray-500 mt-1">{idea?.title}</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decision
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setApprovalStatus("approved")}
                className={`flex-1 px-4 py-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                  approvalStatus === "approved"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 hover:border-green-300"
                }`}
              >
                <Check className="w-6 h-6 mb-2" />
                <span className="font-medium">Approve All</span>
              </button>
              <button
                type="button"
                onClick={() => setApprovalStatus("rejected")}
                className={`flex-1 px-4 py-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                  approvalStatus === "rejected"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-300 hover:border-red-300"
                }`}
              >
                <X className="w-6 h-6 mb-2" />
                <span className="font-medium">Reject All</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Explain your decision for approving or rejecting all phases..."
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all flex items-center gap-2 ${
              approvalStatus === "approved"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {submitting ? "Processing..." : (
              <>
                {approvalStatus === "approved" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                {approvalStatus === "approved" ? "Approve All" : "Reject All"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const GanttChartTabs = () => {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [ganttCharts, setGanttCharts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [modalGantt, setModalGantt] = useState(null);
  const [showBulkApproval, setShowBulkApproval] = useState(false);

  // Fetch all committee ideas
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("committee_token");
        const res = await axios.get(
          "http://127.0.0.1:8000/api/committee/ideas-full-clean",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIdeas(res.data.ideas || []);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching ideas.");
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  // Fetch Gantt charts for selected idea with tasks
  useEffect(() => {
    if (!selectedIdea) return;
    const fetchGantt = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("committee_token");
        const res = await axios.get(
          `http://127.0.0.1:8000/api/committee/ideas/${selectedIdea.id}/gantt-charts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGanttCharts(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "An error occurred while fetching phase charts.");
      } finally {
        setLoading(false);
      }
    };
    fetchGantt();
  }, [selectedIdea]);

  const handleSelectIdea = (idea) => {
    setSelectedIdea(idea);
    setShowBulkApproval(false);
  };

  const evaluatePhase = (gantt) => setModalGantt(gantt);

  const handleModalSubmit = async ({ score, comments }) => {
    if (!modalGantt || !selectedIdea) return;
    try {
      setSubmitting(true);
      const token = localStorage.getItem("committee_token");

      const res = await axios.post(
        `http://127.0.0.1:8000/api/ideas/${selectedIdea.id}/phase-evaluation/${modalGantt.id}`,
        { score, comments },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);

      setGanttCharts((prev) =>
        prev.map((chart) =>
          chart.id === modalGantt.id
            ? { ...chart, evaluation_score: score, evaluation_comments: comments }
            : chart
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred while evaluating the phase.");
    } finally {
      setSubmitting(false);
      setModalGantt(null);
    }
  };

  const handleBulkApproval = async ({ approval_status, reason }) => {
    if (!selectedIdea) return;
    try {
      setSubmitting(true);
      const token = localStorage.getItem("committee_token");

      const res = await axios.post(
        `http://127.0.0.1:8000/api/ideas/${selectedIdea.id}/gantt/approve-or-reject`,
        { approval_status, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);

      // Update all phases with the new approval status
      setGanttCharts((prev) =>
        prev.map((chart) => ({
          ...chart,
          approval_status: approval_status
        }))
      );
      
      setShowBulkApproval(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "An error occurred while updating phase approvals.");
    } finally {
      setSubmitting(false);
    }
  };

  // Check if all phases have the same approval status
  const allPhasesStatus = () => {
    if (ganttCharts.length === 0) return null;
    
    const firstStatus = ganttCharts[0]?.approval_status;
    const allSame = ganttCharts.every(chart => chart.approval_status === firstStatus);
    
    return allSame ? firstStatus : 'mixed';
  };

  const getApprovalStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-sm font-medium ";
    const config = {
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      pending: "bg-gray-100 text-gray-700",
      null: "bg-gray-100 text-gray-700"
    };
    
    return base + (config[status] || "bg-yellow-100 text-yellow-700");
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gantt Charts & Phases</h2>
          <p className="text-gray-500 text-sm mt-1">
            Evaluate project phases and track progress
          </p>
        </div>
      </div>

      {/* Idea Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Select Project</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              onClick={() => handleSelectIdea(idea)}
              className={`cursor-pointer p-4 rounded-lg border transition-all ${
                selectedIdea?.id === idea.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{idea.title}</h4>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{idea.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Charts Display */}
      {!selectedIdea ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base font-medium text-gray-400">Select a Project</h3>
          <p className="text-gray-400 text-sm mt-2">Choose a project to view its phases</p>
        </div>
      ) : loading ? (
        <div className="flex flex-col justify-center items-center h-48 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-600"></div>
          <p className="text-gray-500 font-medium">Loading phases...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : ganttCharts.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <BarChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base font-medium text-gray-400">No Phases Found</h3>
          <p className="text-gray-400 text-sm mt-2">No phases have been added to this project</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Bulk Approval Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Committee Approval Decision
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Approve or reject all phases for this project
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-sm text-gray-600 mr-2">Overall Status:</span>
                  <span className={getApprovalStatusBadge(allPhasesStatus())}>
                    {allPhasesStatus() === 'mixed' ? 'Mixed Status' : 
                     allPhasesStatus() || allPhasesStatus() === 'null' ? 'Pending' : 
                     allPhasesStatus()}
                  </span>
                </div>
                <button
                  onClick={() => setShowBulkApproval(true)}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve/Reject All
                </button>
              </div>
            </div>
          </div>

          {/* Phases List */}
          {ganttCharts.map((chart) => (
            <div key={chart.id} className="bg-white rounded-xl border border-gray-200 p-6">
              {/* Phase Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div>
                      <span className={getApprovalStatusBadge(chart.approval_status)}>
                        {chart.approval_status || 'pending'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{chart.phase_name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(chart.start_date).toLocaleDateString('en-US')} - {new Date(chart.end_date).toLocaleDateString('en-US')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart className="w-4 h-4" />
                          <span>Score: {chart.evaluation_score ?? "Not evaluated"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => evaluatePhase(chart)}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Evaluate
                </button>
              </div>

              {/* Tasks in Phase */}
              {chart.tasks && chart.tasks.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Tasks ({chart.tasks.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chart.tasks.map((task) => (
                      <div key={task.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">{task.task_name}</h5>
                          <span className={`text-xs px-2 py-1 rounded ${
                            task.status === 'completed' ? 'bg-green-100 text-green-700' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {task.status || 'pending'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mb-3">
                          <div>
                            <span className="font-medium">Start:</span>
                            <br />
                            {new Date(task.start_date).toLocaleDateString('en-US')}
                          </div>
                          <div>
                            <span className="font-medium">End:</span>
                            <br />
                            {new Date(task.end_date).toLocaleDateString('en-US')}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-medium text-gray-700">Progress:</span>
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                              <div 
                                className="h-full bg-green-500" 
                                style={{ width: `${task.progress_percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{task.progress_percentage}%</span>
                          </div>
                          
                          {/* Attachments */}
                          {task.attachments && task.attachments !== "null" && (
                            <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              Attachments
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Evaluation Modal */}
      {modalGantt && (
        <PhaseEvaluationModal
          gantt={modalGantt}
          onClose={() => setModalGantt(null)}
          onSubmit={handleModalSubmit}
          submitting={submitting}
        />
      )}

      {/* Bulk Approval Modal */}
      {showBulkApproval && selectedIdea && (
        <BulkApprovalModal
          idea={selectedIdea}
          onClose={() => setShowBulkApproval(false)}
          onSubmit={handleBulkApproval}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default GanttChartTabs;