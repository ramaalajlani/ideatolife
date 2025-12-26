
import React, { useState } from "react";

const ViewAllBMC = ({ bmcs }) => {
  const [selectedBmc, setSelectedBmc] = useState(null);
  const [selectedMeetingBmc, setSelectedMeetingBmc] = useState(null);
  const [formData, setFormData] = useState({
    score: "",
    strengths: "",
    weaknesses: "",
    financial_analysis: "",
    risks: "",
    recommendation: "",
    comments: "",
  });
  const [meetingData, setMeetingData] = useState({
    meeting_date: "",
    meeting_link: "",
    notes: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [meetingSuccess, setMeetingSuccess] = useState("");
  const [meetingError, setMeetingError] = useState("");

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "قيد الانتظار" },
      approved: { color: "bg-green-100 text-green-800", text: "معتمد" },
      rejected: { color: "bg-red-100 text-red-800", text: "مرفوض" },
      in_progress: { color: "bg-blue-100 text-blue-800", text: "قيد التنفيذ" }
    };
    return config[status?.toLowerCase()] || { color: "bg-gray-100 text-gray-800", text: status || "N/A" };
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMeetingChange = (e) => {
    setMeetingData({ ...meetingData, [e.target.name]: e.target.value });
  };

  const handleEvaluate = (bmcId) => {
    setSelectedBmc(bmcId);
    setSuccess("");
    setError("");
  };

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not authenticated!");
      return;
    }

    const scoreValue = Number(formData.score);
    if (isNaN(scoreValue) || scoreValue < 30 || scoreValue > 100) {
      setError("⚠️ Score must be between 30 and 100.");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/ideas/${selectedBmc}/advanced-evaluation`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ Evaluation submitted successfully!");
        setFormData({
          score: "",
          strengths: "",
          weaknesses: "",
          financial_analysis: "",
          risks: "",
          recommendation: "",
          comments: "",
        });
        setSelectedBmc(null);
      } else {
        setError(data.message || "❌ Failed to submit evaluation.");
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Error while submitting evaluation.");
    }
  };

  const handleOpenMeetingPopup = (bmcId) => {
    setSelectedMeetingBmc(bmcId);
    setMeetingData({ meeting_date: "", meeting_link: "", notes: "" });
    setMeetingError("");
    setMeetingSuccess("");
  };

  const handleSubmitMeeting = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMeetingError("You are not authenticated!");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/ideas/${selectedMeetingBmc}/advanced-meeting`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(meetingData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMeetingSuccess("✅ Advanced meeting scheduled successfully!");
        setSelectedMeetingBmc(null);
      } else {
        setMeetingError(data.message || "❌ Failed to schedule meeting.");
      }
    } catch (err) {
      console.error(err);
      setMeetingError("⚠️ Error while scheduling meeting.");
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <div className="p-4 bg-green-50 text-green-800 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg">
          {error}
        </div>
      )}
      {meetingSuccess && (
        <div className="p-4 bg-green-50 text-green-800 rounded-lg">
          {meetingSuccess}
        </div>
      )}
      {meetingError && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg">
          {meetingError}
        </div>
      )}

      {bmcs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد نماذج عمل متاحة</h3>
          <p className="text-gray-600">سيتم عرض نماذج العمل هنا عند توفرها</p>
        </div>
      ) : (
        <div className="space-y-8">
          {bmcs.map((bmc) => (
            <div key={bmc.idea_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 bg-emerald-50 border-b border-emerald-200">
                <h3 className="text-xl font-bold text-emerald-900 text-center">
                  {bmc.idea_title || "Untitled Idea"}
                </h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">الوصف</h4>
                    <p className="text-gray-800">{bmc.idea_description || "No description"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">الحالة</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(bmc.idea_status).color}`}>
                      {getStatusBadge(bmc.idea_status).text}
                    </span>
                  </div>
                </div>

                {bmc.business_plan && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                      {[
                        { label: "Key Partners", value: bmc.business_plan.key_partners },
                        { label: "Key Activities", value: bmc.business_plan.key_activities },
                        { label: "Key Resources", value: bmc.business_plan.key_resources },
                        { label: "Value Proposition", value: bmc.business_plan.value_proposition },
                        { label: "Customer Relationships", value: bmc.business_plan.customer_relationships },
                        { label: "Channels", value: bmc.business_plan.channels },
                        { label: "Customer Segments", value: bmc.business_plan.customer_segments },
                        { label: "Cost Structure", value: bmc.business_plan.cost_structure },
                        { label: "Revenue Streams", value: bmc.business_plan.revenue_streams },
                      ].map((item, index) => (
                        <div key={index} className="p-4">
                          <h5 className="font-medium text-gray-700 mb-1">{item.label}</h5>
                          <p className="text-sm text-gray-600">{item.value || "—"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleEvaluate(bmc.idea_id)}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    📝 تقييم النموذج
                  </button>
                  <button
                    onClick={() => handleOpenMeetingPopup(bmc.idea_id)}
                    className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    📅 جدولة اجتماع
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Evaluation Modal */}
      {selectedBmc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">تقييم نموذج العمل #{selectedBmc}</h3>
            </div>

            <form onSubmit={handleSubmitEvaluation} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  النتيجة (30–100)
                </label>
                <input
                  type="number"
                  name="score"
                  value={formData.score}
                  onChange={handleChange}
                  min="30"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="أدخل درجة بين 30 و 100"
                  required
                />
              </div>

              {["strengths", "weaknesses", "financial_analysis", "risks", "recommendation", "comments"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {field.replace(/_/g, " ")}
                  </label>
                  <textarea
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  ✅ إرسال التقييم
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBmc(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium"
                >
                  ❌ إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Meeting Modal */}
      {selectedMeetingBmc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">جدولة اجتماع للنموذج #{selectedMeetingBmc}</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ ووقت الاجتماع
                </label>
                <input
                  type="datetime-local"
                  name="meeting_date"
                  value={meetingData.meeting_date}
                  onChange={handleMeetingChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الاجتماع
                </label>
                <input
                  type="text"
                  name="meeting_link"
                  value={meetingData.meeting_link}
                  onChange={handleMeetingChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="رابط الاجتماع"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الملاحظات
                </label>
                <textarea
                  name="notes"
                  value={meetingData.notes}
                  onChange={handleMeetingChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmitMeeting}
                  className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  ✅ جدولة الاجتماع
                </button>
                <button
                  onClick={() => setSelectedMeetingBmc(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium"
                >
                  ❌ إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllBMC;