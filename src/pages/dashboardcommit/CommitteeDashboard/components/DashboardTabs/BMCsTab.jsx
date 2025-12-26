import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Eye } from "lucide-react";

const BMCsTab = () => {
  const [bmcs, setBmcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBMC, setSelectedBMC] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [evaluatingBMC, setEvaluatingBMC] = useState(null);
  const [showEvaluation, setShowEvaluation] = useState(false);

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
      const res = await axios.get("http://localhost:8000/api/committee/bmcs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBmcs(res.data.data || []);
    } catch (err) {
      setError("فشل تحميل البيانات");
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
      await axios.post(
        `http://localhost:8000/api/ideas/${evaluatingBMC.idea_id}/advanced-evaluation`,
        evaluationData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ تم إرسال التقييم بنجاح");
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
      alert(err.response?.data?.message || "❌ فشل إرسال التقييم");
    }
  };

  /* ================= STATUS STYLES ================= */
  const statusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "needs_revision":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /* ================= CHECK IF CAN EVALUATE ================= */
  const canEvaluate = (bmc) => {
    const meetingDate = bmc.business_plan?.meeting_date
      ? new Date(bmc.business_plan.meeting_date)
      : null;
    const now = new Date();
    return (
      bmc.business_plan?.latest_score === null && // لم يتم التقييم بعد
      meetingDate &&
      meetingDate <= now // الاجتماع انتهى
    );
  };

  if (loading) return <p className="text-center">⏳ Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="p-4">
      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bmcs.map((bmc) => (
          <div
            key={bmc.idea_id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold mb-1">{bmc.idea_title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {bmc.idea_description}
              </p>

              <span
                className={`inline-block mt-3 px-3 py-1 text-xs rounded-full ${statusStyle(
                  bmc.business_plan?.status
                )}`}
              >
                {bmc.business_plan?.status}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setSelectedBMC(bmc);
                  setShowDetails(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
              >
                <Eye size={16} /> عرض
              </button>

              {canEvaluate(bmc) && (
                <button
                  onClick={() => {
                    setEvaluatingBMC(bmc);
                    setShowEvaluation(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  <CheckCircle size={16} /> تقييم
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= DETAILS MODAL ================= */}
      {showDetails && selectedBMC && (
        <Modal onClose={() => setShowDetails(false)}>
          <h2 className="text-xl font-bold mb-4">{selectedBMC.idea_title}</h2>

          <div className="space-y-3 text-sm">
            {Object.entries(selectedBMC.business_plan || {}).map(
              ([key, value]) =>
                typeof value === "string" && (
                  <div key={key}>
                    <span className="font-semibold">
                      {key.replace(/_/g, " ")}
                    </span>
                    <p className="text-gray-600">{value}</p>
                  </div>
                )
            )}
          </div>
        </Modal>
      )}

      {/* ================= EVALUATION MODAL ================= */}
      {showEvaluation && evaluatingBMC && (
        <Modal onClose={() => setShowEvaluation(false)}>
          <h2 className="text-lg font-bold mb-4">تقييم خطة العمل (BMC)</h2>

          <input
            type="number"
            placeholder="Score (0-100)"
            className="input"
            value={evaluationData.score}
            onChange={(e) =>
              setEvaluationData({ ...evaluationData, score: e.target.value })
            }
          />

          {[
            "strengths",
            "weaknesses",
            "financial_analysis",
            "risks",
            "recommendation",
            "comments",
          ].map((field) => (
            <textarea
              key={field}
              placeholder={field.replace("_", " ")}
              className="input"
              value={evaluationData[field]}
              onChange={(e) =>
                setEvaluationData({ ...evaluationData, [field]: e.target.value })
              }
            />
          ))}

          <button
            onClick={submitEvaluation}
            className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            ✔️ إرسال التقييم
          </button>
        </Modal>
      )}
    </div>
  );
};

/* ================= MODAL COMPONENT ================= */
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-2xl rounded-2xl p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-black"
      >
        ✕
      </button>
      {children}
    </div>
  </div>
);

export default BMCsTab;
