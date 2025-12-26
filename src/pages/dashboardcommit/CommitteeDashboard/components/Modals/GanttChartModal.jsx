// src/pages/dashboardcommit/CommitteeDashboard/components/Modals/GanttChartModal.jsx
import React, { useState } from "react";

const GanttChartModal = ({ idea, ganttData, onClose, onApproveRejectAll, token }) => {
  const [expandedPhases, setExpandedPhases] = useState({});
  const [selectedPhaseForEval, setSelectedPhaseForEval] = useState(null);
  const [evaluationData, setEvaluationData] = useState({ score: "", comments: "" });
  const [evalErrors, setEvalErrors] = useState([]);
  const [evalSuccess, setEvalSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApproveRejectButtons, setShowApproveRejectButtons] = useState(true);

  const togglePhaseExpansion = (phaseId) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const handleEvaluatePhase = (phase) => {
    setSelectedPhaseForEval(phase);
    setEvalErrors([]);
    setEvalSuccess("");
    setEvaluationData({
      score: phase.evaluation_score?.toString() || "",
      comments: phase.evaluation_comments || ""
    });
  };

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    if (!selectedPhaseForEval || !idea) return;

    setIsSubmitting(true);
    setEvalErrors([]);
    setEvalSuccess("");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/ideas/${idea.idea_id}/phase-evaluation/${selectedPhaseForEval.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score: parseInt(evaluationData.score),
          comments: evaluationData.comments || null
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setEvalSuccess("✅ تم إرسال التقييم بنجاح");
        setTimeout(() => {
          setSelectedPhaseForEval(null);
          setEvalSuccess("");
        }, 2000);
      } else {
        setEvalErrors([data.message || "⚠️ فشل في إرسال التقييم"]);
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          setEvalErrors(errorMessages);
        }
      }
    } catch (error) {
      setEvalErrors(["⚠️ خطأ في الاتصال بالخادم"]);
      console.error("Error submitting evaluation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveAll = () => {
    if (window.confirm("هل أنت متأكد من الموافقة على جميع مراحل هذه الفكرة؟")) {
      onApproveRejectAll('approved');
      setShowApproveRejectButtons(false);
    }
  };

  const handleRejectAll = () => {
    if (window.confirm("هل أنت متأكد من رفض جميع مراحل هذه الفكرة؟")) {
      onApproveRejectAll('rejected');
      setShowApproveRejectButtons(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "قيد الانتظار" },
      in_progress: { color: "bg-blue-100 text-blue-800", text: "قيد التنفيذ" },
      completed: { color: "bg-green-100 text-green-800", text: "مكتمل" },
      approved: { color: "bg-emerald-100 text-emerald-800", text: "معتمد" },
      rejected: { color: "bg-red-100 text-red-800", text: "مرفوض" }
    };
    return config[status] || { color: "bg-gray-100 text-gray-800", text: status };
  };

  const allPhasesApproved = ganttData.length > 0 && ganttData.every(phase => phase.approval_status === 'approved');
  const allPhasesRejected = ganttData.length > 0 && ganttData.every(phase => phase.approval_status === 'rejected');

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={onClose}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 mb-2"
              >
                ← رجوع للوحة التحكم
              </button>
              <h1 className="text-2xl font-bold text-gray-900">مخطط جانت للمشروع</h1>
              <p className="text-sm text-gray-600">{idea?.title || "غير معروف"}</p>
            </div>

            <div className="flex items-center gap-3">
              {showApproveRejectButtons && !allPhasesApproved && !allPhasesRejected && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleApproveAll}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
                  >
                    الموافقة على الكل
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                  >
                    رفض الكل
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-8 max-w-7xl mx-auto">
        {ganttData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مراحل مخططة</h3>
            <p className="text-gray-600">لم يتم إضافة أي مراحل تنفيذية لهذه الفكرة بعد.</p>
          </div>
        ) : (
          <>
            {/* Phases Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">المراحل والمهام</h2>
                <p className="text-sm text-gray-600">تفاصيل جميع مراحل المشروع ومهامه</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">التفاصيل</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">المرحلة</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">الحالة</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">التواريخ</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">الإنجاز</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">الاعتماد</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {ganttData.map((phase, index) => (
                      <React.Fragment key={phase.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <button
                              onClick={() => togglePhaseExpansion(phase.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              {expandedPhases[phase.id] ? "إخفاء التفاصيل" : "عرض التفاصيل"}
                            </button>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">{phase.phase_name}</h3>
                              {phase.description && (
                                <p className="text-sm text-gray-600 mt-1">{phase.description}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(phase.status).color}`}>
                              {getStatusBadge(phase.status).text}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              <div className="text-gray-600">من: {phase.start_date}</div>
                              <div className="text-gray-600">إلى: {phase.end_date}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-700">{phase.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-blue-600"
                                  style={{ width: `${phase.progress}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(phase.approval_status || 'pending').color}`}>
                              {getStatusBadge(phase.approval_status || 'pending').text}
                            </span>
                            {phase.evaluation_score && (
                              <div className="text-xs text-gray-600 mt-1">
                                التقييم: {phase.evaluation_score}/100
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleEvaluatePhase(phase)}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                            >
                              تقييم
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Tasks */}
                        {expandedPhases[phase.id] && phase.tasks?.length > 0 && (
                          <tr>
                            <td colSpan="7" className="p-0">
                              <div className="bg-gray-50 border-t border-gray-200 px-6 py-6">
                                <h4 className="text-sm font-bold text-gray-900 mb-4">
                                  المهام التنفيذية ({phase.tasks.length} مهمة)
                                </h4>
                                
                                <div className="space-y-4">
                                  {phase.tasks.map((task) => (
                                    <div key={task.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex-1">
                                          <h5 className="font-bold text-gray-900">{task.task_name}</h5>
                                          {task.description && (
                                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                          )}
                                        </div>
                                        
                                        <div className="lg:w-auto">
                                          <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status).color}`}>
                                                {getStatusBadge(task.status).text}
                                              </span>
                                              <div className="text-sm text-gray-600">
                                                <div>من: {task.start_date}</div>
                                                <div>إلى: {task.end_date}</div>
                                              </div>
                                            </div>
                                            
                                            <div className="w-full lg:w-48">
                                              <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-700">{task.progress_percentage}%</span>
                                              </div>
                                              <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                  className="h-2 rounded-full bg-green-600"
                                                  style={{ width: `${task.progress_percentage}%` }}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bulk Actions Footer */}
            {(showApproveRejectButtons && !allPhasesApproved && !allPhasesRejected) || (allPhasesApproved || allPhasesRejected) && (
              <div className="mt-8 flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200">
                {showApproveRejectButtons && !allPhasesApproved && !allPhasesRejected && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleApproveAll}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
                    >
                      الموافقة على جميع المراحل
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                    >
                      رفض جميع المراحل
                    </button>
                  </div>
                )}
                
                {(allPhasesApproved || allPhasesRejected) && (
                  <div className={`px-4 py-2.5 rounded-lg ${allPhasesApproved ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                    <span className="font-medium">
                      {allPhasesApproved ? '✅ تم اعتماد جميع المراحل' : '❌ تم رفض جميع المراحل'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Evaluation Modal */}
      {selectedPhaseForEval && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">تقييم المرحلة</h3>
                <p className="text-sm text-gray-600">{selectedPhaseForEval.phase_name}</p>
              </div>
              <button
                onClick={() => !isSubmitting && setSelectedPhaseForEval(null)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEvaluation} className="p-6 space-y-5">
              {evalSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-sm">
                  {evalSuccess}
                </div>
              )}

              {evalErrors.length > 0 && (
                <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm">
                  {evalErrors.map((err, i) => (
                    <p key={i} className="text-sm">⚠️ {err}</p>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  نتيجة التقييم (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={evaluationData.score}
                  onChange={(e) => setEvaluationData({ ...evaluationData, score: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل درجة التقييم"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  ملاحظات التقييم
                </label>
                <textarea
                  value={evaluationData.comments}
                  onChange={(e) => setEvaluationData({ ...evaluationData, comments: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل ملاحظاتك..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => !isSubmitting && setSelectedPhaseForEval(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GanttChartModal;