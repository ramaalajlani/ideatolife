// src/pages/dashboardcommit/CommitteeDashboard/components/Modals/EditMeetingModal.jsx
import React, { useState } from "react";

const EditMeetingModal = ({ meeting, meetingData, onClose, onUpdate }) => {
  const [localData, setLocalData] = useState(meetingData);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/committee/meetings/${meeting.meeting_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(localData),
      });

      const data = await res.json();

      if (res.ok) {
        onUpdate(localData);
        onClose();
      } else {
        setErrors([data.message || "⚠️ Could not update meeting."]);
      }
    } catch (error) {
      setErrors(["⚠️ Could not connect to the server."]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">تعديل الاجتماع #{meeting.meeting_id}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.length > 0 && (
            <div className="p-3 bg-red-50 text-red-800 rounded-lg">
              {errors.map((err, i) => (
                <p key={i} className="text-sm">⚠️ {err}</p>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رابط الاجتماع
            </label>
            <input
              type="url"
              value={localData.meeting_link}
              onChange={(e) => setLocalData({...localData, meeting_link: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://meet.google.com/..."
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الملاحظات
            </label>
            <textarea
              value={localData.notes}
              onChange={(e) => setLocalData({...localData, notes: e.target.value})}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل ملاحظات الاجتماع..."
              disabled={submitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {submitting ? "جاري الحفظ..." : "💾 حفظ التغييرات"}
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

export default EditMeetingModal;