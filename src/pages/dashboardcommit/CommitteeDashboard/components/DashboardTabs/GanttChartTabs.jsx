import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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

// Task Attachments Modal
const TaskAttachmentsModal = ({ task, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task?.attachments) {
      try {
        const parsed = JSON.parse(task.attachments);
        setAttachments(Array.isArray(parsed) ? parsed : [parsed]);
      } catch (err) {
        setAttachments([task.attachments]);
      }
    }
  }, [task]);

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'image';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'word';
    if (['xls', 'xlsx'].includes(ext)) return 'excel';
    return 'file';
  };

  const getFileUrl = (path) => {
    return `http://127.0.0.1:8000/storage/${path}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 text-left font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col border border-gray-200">
        <div className="p-5 border-b border-gray-200 bg-gray-50 rounded-t-lg flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Task Attachments</h3>
            <p className="text-sm text-gray-500">{task?.task_name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">Loading attachments...</div>
          ) : attachments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {attachments.map((attachment, index) => {
                const fileType = getFileType(attachment);
                const fileUrl = getFileUrl(attachment);
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-3 bg-gray-50 border-b border-gray-200">
                      <p className="text-xs font-medium text-gray-700 truncate">
                        {attachment.split('/').pop()}
                      </p>
                    </div>
                    <div className="p-4 flex flex-col items-center">
                      {fileType === 'image' ? (
                        <img 
                          src={fileUrl} 
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-48 object-cover rounded-md mb-3"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md mb-3">
                          <div className="text-center">
                            <div className="text-4xl mb-2">
                              {fileType === 'pdf' ? '📄' : fileType === 'word' ? '📝' : fileType === 'excel' ? '📊' : '📎'}
                            </div>
                            <p className="text-xs text-gray-500">{fileType.toUpperCase()} File</p>
                          </div>
                        </div>
                      )}
                      <a 
                        href={fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View/Download
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 italic">No attachments available for this task</div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 font-medium hover:text-gray-800 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Ideas Cards View Component
const IdeasCardsView = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const handleCardClick = (idea) => {
    // حفظ بيانات الفكرة محلياً لتجنب طلب API إضافي
    localStorage.setItem('selectedIdea', JSON.stringify(idea));
    navigate(`/gantt-charts/${idea.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading ideas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 font-sans text-left text-gray-900">
      <header className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Gantt Charts & Phases Management</h2>
        <p className="text-gray-500 text-sm mt-1">Select a project to view and manage its phases</p>
      </header>

      {/* Ideas Cards Grid */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Select Project</h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <div 
              key={idea.id}
              onClick={() => handleCardClick(idea)}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden group"
            >
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-gray-900 text-base line-clamp-2">{idea.title}</h4>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                    #{idea.id}
                  </span>
                </div>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">{idea.description}</p>
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">
                  Click to view phases
                </span>
                <div className="text-orange-600 group-hover:translate-x-1 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {ideas.length === 0 && !loading && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl py-16 text-center">
            <p className="text-gray-400 font-semibold uppercase text-sm tracking-widest">No projects available</p>
          </div>
        )}
      </section>
    </div>
  );
};

// Gantt Chart Details Component
const GanttChartDetails = () => {
  const { ideaId } = useParams();
  const [idea, setIdea] = useState(null);
  const [ganttCharts, setGanttCharts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [modalGantt, setModalGantt] = useState(null);
  const [showBulkApproval, setShowBulkApproval] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [penaltyData, setPenaltyData] = useState(null);
  const [loadingPenalty, setLoadingPenalty] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIdeaAndData = async () => {
      if (!ideaId) return;

      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("committee_token");
        
        // محاولة الحصول على الفكرة من localStorage أولاً
        const savedIdea = localStorage.getItem('selectedIdea');
        if (savedIdea) {
          const parsedIdea = JSON.parse(savedIdea);
          if (parsedIdea.id == ideaId) {
            setIdea(parsedIdea);
          } else {
            // إذا كان الـ ID مختلف، نحاول الحصول من API
            // استخدام endpoint مختلف للحصول على الفكرة
            try {
              const ideaRes = await axios.get(`http://127.0.0.1:8000/api/committee/ideas/${ideaId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setIdea(ideaRes.data);
            } catch (ideaErr) {
              // إذا فشل الـ API، نستخدم البيانات المحفوظة كبديل
              setIdea({
                id: ideaId,
                title: parsedIdea.title || `Project #${ideaId}`,
                description: parsedIdea.description || "No description available"
              });
            }
          }
        } else {
          // محاولة الحصول من API
          try {
            const ideaRes = await axios.get(`http://127.0.0.1:8000/api/committee/ideas/${ideaId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setIdea(ideaRes.data);
          } catch (ideaErr) {
            setIdea({
              id: ideaId,
              title: `Project #${ideaId}`,
              description: "No description available"
            });
          }
        }

        // Fetch gantt charts
        const ganttRes = await axios.get(`http://127.0.0.1:8000/api/gantt-charts/${ideaId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGanttCharts(ganttRes.data.data || []);

        // Fetch penalty data
        setLoadingPenalty(true);
        try {
          const penaltyRes = await axios.get(`http://127.0.0.1:8000/api/ideas/${ideaId}/penalty-payment`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPenaltyData({ 
            ...penaltyRes.data, 
            paid: true, 
            penalty_amount: penaltyRes.data.transaction?.amount || 0 
          });
        } catch (penaltyErr) {
          if (penaltyErr.response?.status === 404) {
            setPenaltyData({ 
              paid: false, 
              penalty_amount: 10000, 
              transaction: null, 
              message: "Penalty not paid yet" 
            });
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

    fetchIdeaAndData();
  }, [ideaId]);

  const handleRefundPenalty = async (refundOption) => {
    if (!ideaId || !penaltyData?.transaction?.id) return;
    try {
      if (!window.confirm(`Confirm refund of ${refundOption} amount?`)) return;
      setSubmitting(true);
      const token = localStorage.getItem("committee_token");
      const res = await axios.post(
        `http://127.0.0.1:8000/api/ideas/${ideaId}/refund-penalty`, 
        { refund_option: refundOption }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert(res.data?.message || "Refund processed successfully");
      setPenaltyData(prev => ({ 
        ...prev, 
        paid: false, 
        transaction: null, 
        message: "Penalty refunded" 
      }));
      setShowRefundModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Refund failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalSubmit = async ({ score, comments }) => {
    if (!modalGantt || !ideaId) return;
    try {
      setSubmitting(true);
      const token = localStorage.getItem("committee_token");
      const res = await axios.post(
        `http://127.0.0.1:8000/api/ideas/${ideaId}/phase-evaluation/${modalGantt.id}`, 
        { score, comments }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
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
      alert("Error evaluating phase.");
    } finally {
      setSubmitting(false);
      setModalGantt(null);
    }
  };

  const handleBulkApproval = async ({ approval_status, reason }) => {
    if (!ideaId) return;
    try {
      setSubmitting(true);
      const token = localStorage.getItem("committee_token");
      const res = await axios.post(
        `http://127.0.0.1:8000/api/ideas/${ideaId}/gantt/approve-or-reject`, 
        { approval_status, reason }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert(res.data.message);
      setGanttCharts((prev) => 
        prev.map((chart) => ({ ...chart, approval_status: approval_status }))
      );
      setShowBulkApproval(false);
    } catch (err) {
      alert("Error updating approvals.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackClick = () => {
    navigate('/committee-dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading project details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button 
          onClick={handleBackClick}
          className="mt-4 px-4 py-2 text-sm text-gray-600 font-medium hover:text-gray-800"
        >
          ← Back to Projects
        </button>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="p-4">
        <div className="text-gray-500">Project not found</div>
        <button 
          onClick={handleBackClick}
          className="mt-4 px-4 py-2 text-sm text-gray-600 font-medium hover:text-gray-800"
        >
          ← Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 font-sans text-left text-gray-900">
      {/* Back Button */}
      <button 
        onClick={handleBackClick}
        className="flex items-center text-sm text-gray-600 font-medium hover:text-gray-800 mb-4"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Projects
      </button>

      {/* Project Header */}
      <header className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{idea.title}</h2>
            <p className="text-gray-500 text-sm mt-1">{idea.description}</p>
          </div>
          <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full">
            Project ID: #{idea.id}
          </span>
        </div>
      </header>

      {/* Penalty Info Card */}
      <section className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-red-50 border-b border-red-100 font-bold text-red-700 text-sm uppercase">
          1. Penalty Information
        </div>
        <div className="p-5">
          {loadingPenalty ? (
            <div className="text-center text-sm text-gray-500">Loading penalty data...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Amount</p>
                <p className="font-semibold text-red-600">
                  {penaltyData?.penalty_amount?.toLocaleString()} SYP
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${penaltyData?.paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {penaltyData?.paid ? "Paid" : "Pending"}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                <p className="font-mono text-xs text-gray-500">
                  {penaltyData?.transaction?.id || "N/A"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Action</p>
                {penaltyData?.paid && (
                  <button 
                    onClick={() => setShowRefundModal(true)}
                    className="text-xs font-bold text-red-600 border border-red-200 px-4 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                  >
                    REFUND PENALTY
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Committee Action Banner */}
      <section className="bg-blue-600 p-5 rounded-lg text-white flex justify-between items-center shadow-md">
        <div>
          <p className="text-xs font-semibold opacity-90 uppercase mb-1">Bulk Phase Control</p>
          <h4 className="font-bold text-lg">Decision for: {idea.title}</h4>
        </div>
        <button 
          onClick={() => setShowBulkApproval(true)}
          className="bg-white text-blue-600 text-sm font-bold px-5 py-2.5 rounded shadow-sm hover:bg-gray-50 transition-all"
        >
          Apply Global Decision
        </button>
      </section>

      {/* Phases Details */}
      <section className="space-y-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          2. Phase Breakdown & Tasks
        </h3>
        
        {ganttCharts.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl py-12 text-center">
            <p className="text-gray-400 font-semibold uppercase text-sm tracking-widest">No phases available for this project</p>
          </div>
        ) : (
          ganttCharts.map((chart) => (
            <div key={chart.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="bg-gray-50 p-5 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900 text-base">{chart.phase_name}</h4>
                  <p className="text-xs text-gray-500 mt-1 font-medium uppercase">
                    Timeline: {chart.start_date} → {chart.end_date} | 
                    Score: <span className="text-orange-600 font-bold ml-1">
                      {chart.evaluation_score ?? "N/A"}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase border ${
                    chart.approval_status === 'approved' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : chart.approval_status === 'rejected'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-white text-gray-400 border-gray-200'
                  }`}>
                    {chart.approval_status || 'pending'}
                  </span>
                  <button 
                    onClick={() => setModalGantt(chart)}
                    className="bg-orange-600 text-white text-xs font-bold px-5 py-2 rounded-md hover:bg-orange-700 transition-colors shadow-sm"
                  >
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
                      <th className="p-4">Attachments</th>
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
                            <span className="font-bold text-gray-700 text-xs min-w-[35px]">
                              {task.progress_percentage}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => setSelectedTask(task)}
                            className="text-xs font-medium text-blue-600 border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            View Attachments
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center text-gray-400 text-sm italic">
                  No tasks assigned to this phase.
                </div>
              )}
            </div>
          ))
        )}
      </section>

      {/* Modals */}
      {modalGantt && (
        <PhaseEvaluationModal 
          gantt={modalGantt} 
          onClose={() => setModalGantt(null)} 
          onSubmit={handleModalSubmit} 
          submitting={submitting} 
        />
      )}
      {showBulkApproval && idea && (
        <BulkApprovalModal 
          idea={idea} 
          onClose={() => setShowBulkApproval(false)} 
          onSubmit={handleBulkApproval} 
          submitting={submitting} 
        />
      )}
      {showRefundModal && (
        <RefundPenaltyModal 
          onClose={() => setShowRefundModal(false)} 
          onSubmit={handleRefundPenalty} 
          submitting={submitting} 
        />
      )}
      {selectedTask && (
        <TaskAttachmentsModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
      )}
    </div>
  );
};

// Main Wrapper Component
const GanttChartTabs = () => {
  const { ideaId } = useParams();
  
  // If ideaId exists in URL params, show details page, otherwise show cards view
  if (ideaId) {
    return <GanttChartDetails />;
  }
  
  return <IdeasCardsView />;
};

export default GanttChartTabs;