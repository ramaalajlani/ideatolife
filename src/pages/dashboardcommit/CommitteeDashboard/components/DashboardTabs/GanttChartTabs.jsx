import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 text-left font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <div className="p-5 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-800">Phase Evaluation</h3>
          <p className="text-sm text-gray-500">{gantt.phase_name}</p>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Score (0-100)</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              placeholder="Enter score"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              placeholder="Add evaluation comments..."
            />
          </div>

          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-lg">
          <button onClick={onClose} disabled={submitting} className="px-4 py-2 text-sm text-gray-600 font-medium hover:text-gray-800 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={submitting} className="px-5 py-2 text-sm font-semibold text-white bg-orange-600 rounded-md shadow-sm hover:bg-orange-700 transition-colors">
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 text-left font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <div className="p-5 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-800">Final Decision</h3>
          <p className="text-sm text-gray-500">{idea?.title}</p>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex gap-3">
            <button
              onClick={() => setApprovalStatus("approved")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-md border transition-all ${approvalStatus === "approved" ? "bg-green-600 text-white border-green-700" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
            >
              APPROVE ALL
            </button>
            <button
              onClick={() => setApprovalStatus("rejected")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-md border transition-all ${approvalStatus === "rejected" ? "bg-red-600 text-white border-red-700" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
            >
              REJECT ALL
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Explain your decision..."
            />
          </div>

          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-lg">
          <button onClick={onClose} disabled={submitting} className="px-4 py-2 text-sm text-gray-600 font-medium hover:text-gray-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-5 py-2 text-sm font-semibold text-white rounded-md shadow-sm transition-colors ${approvalStatus === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
          >
            {submitting ? "Processing..." : "Confirm Decision"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Refund Penalty Modal
const RefundPenaltyModal = ({ onClose, onSubmit, submitting }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 text-left font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm rounded-t-lg">
          Refund Options
        </div>
        <div className="p-5 space-y-3">
          <button onClick={() => onSubmit("full")} disabled={submitting} className="w-full py-2.5 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">
            REFUND FULL AMOUNT
          </button>
          <button onClick={() => onSubmit("half")} disabled={submitting} className="w-full py-2.5 text-sm font-semibold text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors">
            REFUND HALF AMOUNT
          </button>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end rounded-b-lg">
          <button onClick={onClose} disabled={submitting} className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">CANCEL</button>
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
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [penaltyData, setPenaltyData] = useState(null);
  const [loadingPenalty, setLoadingPenalty] = useState(false);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("committee_token");
        const res = await axios.get("http://127.0.0.1:8000/api/committee/ideas-full-clean", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIdeas(res.data.ideas || []);
      } catch (err) {
        setError("An error occurred while fetching ideas.");
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  useEffect(() => {
    if (!selectedIdea) return;
    const fetchGanttAndPenalty = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("committee_token");
        const ganttRes = await axios.get(`http://127.0.0.1:8000/api/committee/ideas/${selectedIdea.id}/gantt-charts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGanttCharts(ganttRes.data.data || []);

        setLoadingPenalty(true);
        try {
          const penaltyRes = await axios.get(`http://127.0.0.1:8000/api/ideas/${selectedIdea.id}/penalty-payment`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPenaltyData({ ...penaltyRes.data, paid: true, penalty_amount: penaltyRes.data.transaction?.amount || 0 });
        } catch (penaltyErr) {
          if (penaltyErr.response?.status === 404) {
            setPenaltyData({ paid: false, penalty_amount: 10000, transaction: null, message: "Penalty not paid yet" });
          } else {
            setPenaltyData(null);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
        setLoadingPenalty(false);
      }
    };
    fetchGanttAndPenalty();
  }, [selectedIdea]);

  const handleSelectIdea = (idea) => {
    setSelectedIdea(idea);
    setShowBulkApproval(false);
  };

  const evaluatePhase = (gantt) => setModalGantt(gantt);

  const handleRefundPenalty = async (refundOption) => {
    if (!selectedIdea || !penaltyData?.transaction?.id) return;
    try {
      if (!window.confirm(`Confirm refund of ${refundOption} amount?`)) return;
      setSubmitting(true);
      const token = localStorage.getItem("committee_token");
      const res = await axios.post(`http://127.0.0.1:8000/api/ideas/${selectedIdea.id}/refund-penalty`, { refund_option: refundOption }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data?.message || "Refund processed successfully");
      setPenaltyData(prev => ({ ...prev, paid: false, transaction: null, message: "Penalty refunded" }));
      setShowRefundModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Refund failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalSubmit = async ({ score, comments }) => {
    if (!modalGantt || !selectedIdea) return;
    try {
      setSubmitting(true);
      const token = localStorage.getItem("committee_token");
      const res = await axios.post(`http://127.0.0.1:8000/api/ideas/${selectedIdea.id}/phase-evaluation/${modalGantt.id}`, { score, comments }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      setGanttCharts((prev) => prev.map((chart) => chart.id === modalGantt.id ? { ...chart, evaluation_score: score, evaluation_comments: comments } : chart));
    } catch (err) {
      alert("Error evaluating phase.");
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
      const res = await axios.post(`http://127.0.0.1:8000/api/ideas/${selectedIdea.id}/gantt/approve-or-reject`, { approval_status, reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      setGanttCharts((prev) => prev.map((chart) => ({ ...chart, approval_status: approval_status })));
      setShowBulkApproval(false);
    } catch (err) {
      alert("Error updating approvals.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 p-4 font-sans text-left text-gray-900" dir="ltr">
      <header className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Gantt Charts & Phases Management</h2>
        <p className="text-gray-500 text-sm mt-1">Project monitoring and evaluation panel</p>
      </header>

      {/* Projects Table */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">1. Select Project</h3>
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-gray-600">
                <th className="p-4 font-semibold uppercase text-xs">Title</th>
                <th className="p-4 font-semibold uppercase text-xs">Description</th>
                <th className="p-4 font-semibold uppercase text-xs text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {ideas.map((idea) => (
                <tr
                  key={idea.id}
                  onClick={() => handleSelectIdea(idea)}
                  className={`cursor-pointer transition-colors ${selectedIdea?.id === idea.id ? "bg-orange-50/50" : "hover:bg-gray-50"}`}
                >
                  <td className="p-4 font-medium text-gray-900">{idea.title}</td>
                  <td className="p-4 text-gray-500 text-sm truncate max-w-xs">{idea.description}</td>
                  <td className="p-4 text-center">
                    <span className={`text-[11px] px-3 py-1 rounded-full font-bold transition-colors ${selectedIdea?.id === idea.id ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-400 group-hover:text-gray-600"}`}>
                      {selectedIdea?.id === idea.id ? "SELECTED" : "SELECT"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedIdea && (
        <>
          {/* Penalty Info Table */}
          <section className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-red-50 border-b border-red-100 font-bold text-red-700 text-sm uppercase">2. Penalty Information</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingPenalty ? (
                    <tr><td colSpan="4" className="p-4 text-center text-sm text-gray-500">Loading penalty data...</td></tr>
                  ) : (
                    <tr>
                      <td className="p-4 font-semibold text-red-600">{penaltyData?.penalty_amount?.toLocaleString()} SYP</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${penaltyData?.paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {penaltyData?.paid ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-gray-500">{penaltyData?.transaction?.id || "N/A"}</td>
                      <td className="p-4 text-right">
                        {penaltyData?.paid && (
                          <button onClick={() => setShowRefundModal(true)} className="text-xs font-bold text-red-600 border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors">
                            REFUND
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Committee Action Banner */}
          <section className="bg-blue-600 p-5 rounded-lg text-white flex justify-between items-center shadow-md">
            <div>
              <p className="text-xs font-semibold opacity-90 uppercase mb-1">Bulk Phase Control</p>
              <h4 className="font-bold text-lg">Decision for: {selectedIdea.title}</h4>
            </div>
            <button onClick={() => setShowBulkApproval(true)} className="bg-white text-blue-600 text-sm font-bold px-5 py-2.5 rounded shadow-sm hover:bg-gray-50 transition-all">
              Apply Global Decision
            </button>
          </section>

          {/* Phases Details Table */}
          <section className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">3. Phase Breakdown & Tasks</h3>
            {ganttCharts.map((chart) => (
              <div key={chart.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="bg-gray-50 p-5 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{chart.phase_name}</h4>
                    <p className="text-xs text-gray-500 mt-1 font-medium uppercase">
                      Timeline: {chart.start_date} → {chart.end_date} | Score: <span className="text-orange-600 font-bold">{chart.evaluation_score ?? "N/A"}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase border ${chart.approval_status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-400 border-gray-200'}`}>
                      {chart.approval_status || 'pending'}
                    </span>
                    <button onClick={() => evaluatePhase(chart)} className="bg-orange-600 text-white text-xs font-bold px-5 py-2 rounded-md hover:bg-orange-700 transition-colors shadow-sm">
                      EVALUATE
                    </button>
                  </div>
                </div>

                {chart.tasks && chart.tasks.length > 0 ? (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white border-b border-gray-100 text-gray-400 uppercase text-[11px] font-bold">
                      <tr>
                        <th className="p-4">Task Name</th>
                        <th className="p-4">Timeline</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {chart.tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            <p className="font-semibold text-gray-800">{task.task_name}</p>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-1 italic">{task.description}</p>
                          </td>
                          <td className="p-4 font-mono text-gray-500 text-xs">
                            {task.start_date} <br/> {task.end_date}
                          </td>
                          <td className="p-4">
                            <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200 text-xs font-semibold uppercase">
                              {task.status || 'pending'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                <div className="h-full bg-green-500" style={{ width: `${task.progress_percentage}%` }} />
                              </div>
                              <span className="font-bold text-gray-700 text-xs min-w-[35px]">{task.progress_percentage}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center text-gray-400 text-sm italic">No tasks assigned to this phase.</div>
                )}
              </div>
            ))}
          </section>
        </>
      )}

      {/* Empty State */}
      {!selectedIdea && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl py-24 text-center">
          <p className="text-gray-400 font-semibold uppercase text-sm tracking-widest">Select a project above to display monitoring data</p>
        </div>
      )}

      {/* Modals */}
      {modalGantt && <PhaseEvaluationModal gantt={modalGantt} onClose={() => setModalGantt(null)} onSubmit={handleModalSubmit} submitting={submitting} />}
      {showBulkApproval && selectedIdea && <BulkApprovalModal idea={selectedIdea} onClose={() => setShowBulkApproval(false)} onSubmit={handleBulkApproval} submitting={submitting} />}
      {showRefundModal && <RefundPenaltyModal onClose={() => setShowRefundModal(false)} onSubmit={handleRefundPenalty} submitting={submitting} />}
    </div>
  );
};

export default GanttChartTabs;