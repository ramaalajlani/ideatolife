// src/pages/dashboardcommit/CommitteeDashboard/components/Modals/EvaluationModal.jsx
import React, { useState, useEffect } from "react";

const EvaluationModal = ({ idea, token, onClose, onSuccess }) => {
  const [evaluationData, setEvaluationData] = useState({
    evaluation_score: "",
    description: "",
    strengths: "",
    weaknesses: "",
    recommendations: "",
  });
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log("EvaluationModal received idea:", idea);
    
    setEvaluationData({
      evaluation_score: "",
      description: "",
      strengths: "",
      weaknesses: "",
      recommendations: "",
    });
    setErrors([]);
    setSubmitting(false);
  }, [idea]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    console.log("Submitting evaluation for idea:", idea);

    if (!idea || (!idea.idea_id && !idea.id)) {
      setErrors(["⚠️ No idea selected for evaluation."]);
      console.error("No idea_id or id found:", idea);
      setSubmitting(false);
      return;
    }

    const score = parseInt(evaluationData.evaluation_score, 10);
    if (isNaN(score) || score < 30 || score > 100) {
      setErrors(["⚠️ Evaluation score must be between 30 and 100"]);
      setSubmitting(false);
      return;
    }

    try {
      const ideaId = idea.idea_id || idea.id;
      const url = `http://127.0.0.1:8000/api/ideas/${ideaId}/evaluate`;
      console.log("Making request to:", url);
      
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          ...evaluationData, 
          evaluation_score: score 
        }),
      });

      const data = await res.json();
      console.log("Response status:", res.status);
      console.log("Response data:", data);

      if (res.ok) {
        onSuccess(`✅ Idea "${idea.title}" evaluated successfully!`);
        onClose();
      } else {
        setErrors([data.message || "⚠️ Failed to send evaluation."]);
      }
    } catch (error) {
      console.error("Evaluation error:", error);
      setErrors(["⚠️ Error connecting to the server."]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setEvaluationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!idea) {
    console.log("No idea provided to EvaluationModal");
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">تقييم الفكرة</h2>
              <p className="text-gray-600 mt-1">{idea.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={submitting}
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.length > 0 && (
            <div className="p-4 bg-red-50 text-red-800 rounded-lg">
              {errors.map((err, i) => (
                <p key={i} className="text-sm">⚠️ {err}</p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">معرف الفكرة</h4>
              <p className="text-gray-900">{idea.idea_id || idea.id}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">الحالة</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                idea.status === 'approved' ? 'bg-green-100 text-green-800' :
                idea.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {idea.status || "Pending"}
              </span>
            </div>
          </div>

          {idea.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">الوصف</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{idea.description}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نتيجة التقييم (30-100)
            </label>
            <input
              type="number"
              min="30"
              max="100"
              value={evaluationData.evaluation_score}
              onChange={(e) => handleChange("evaluation_score", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل درجة بين 30 و 100"
              required
              disabled={submitting}
            />
          </div>

          {[
            { field: "description", label: "وصف التقييم", rows: 3 },
            { field: "strengths", label: "نقاط القوة", rows: 2 },
            { field: "weaknesses", label: "نقاط الضعف", rows: 2 },
            { field: "recommendations", label: "التوصيات", rows: 2 },
          ].map(({ field, label, rows }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <textarea
                value={evaluationData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                rows={rows}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`أدخل ${label.toLowerCase()}...`}
                disabled={submitting}
              />
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluationModal;