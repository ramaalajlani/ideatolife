// src/pages/dashboardcommit/CommitteeDashboard/components/DashboardTabs/FundingRequestsTab.jsx
import React, { useState, useEffect } from "react";

const FundingRequestsTab = () => {
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedFunding, setSelectedFunding] = useState(null);
  const [evaluation, setEvaluation] = useState({
    is_approved: false,
    approved_amount: "",
    committee_notes: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFundings = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/committee/fundings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok && data.funding_requests) {
          setFundings(data.funding_requests);
        } else {
          setMessage(data.message || "لا توجد طلبات تمويل حالياً.");
        }
      } catch (err) {
        console.error(err);
        setMessage("حدث خطأ أثناء جلب طلبات التمويل.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchFundings();
  }, [token]);

  const handleEvaluate = async (id) => {
    try {
      const requestData = {
        is_approved: evaluation.is_approved,
        approved_amount: evaluation.approved_amount || 0,
        committee_notes: evaluation.committee_notes || "",
      };
      
      const res = await fetch(`http://127.0.0.1:8000/api/fundings/${id}/evaluate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ تم تقييم طلب التمويل بنجاح!");
        setSelectedFunding(null);
        // Refresh list
        const updatedRes = await fetch("http://127.0.0.1:8000/api/committee/fundings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const updatedData = await updatedRes.json();
        if (updatedRes.ok) setFundings(updatedData.funding_requests || []);
      } else {
        alert(`❌ فشل التقييم: ${data.message || "حدث خطأ ما"}`);
      }
    } catch (err) {
      console.error("Error evaluating funding:", err);
      alert("⚠️ حدث خطأ في الاتصال بالخادم.");
    }
  };

  const handleOpenEvaluation = (funding) => {
    setSelectedFunding(funding);
    setEvaluation({
      is_approved: false,
      approved_amount: funding.requested_amount || "",
      committee_notes: "",
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      under_review: { text: "قيد المراجعة", color: "bg-yellow-100 text-yellow-800" },
      approved: { text: "موافقة", color: "bg-green-100 text-green-800" },
      funded: { text: "ممول", color: "bg-emerald-100 text-emerald-800" },
      rejected: { text: "مرفوض", color: "bg-red-100 text-red-800" }
    };
    return statusMap[status] || { text: status, color: "bg-gray-100 text-gray-800" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">⏳ جاري تحميل طلبات التمويل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">طلبات التمويل الواردة</h2>
            <p className="text-gray-600">مراجعة وتقييم طلبات التمويل المقدمة للجنة</p>
          </div>
          <span className="text-3xl">💰</span>
        </div>
      </div>

      {message && (
        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg">
          {message}
        </div>
      )}

      {fundings.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">الفكرة</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">صاحب الفكرة</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">المرحلة</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">المهمة</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">المبلغ المطلوب</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">المبرر</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">الحالة</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">تاريخ الإرسال</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fundings.map((f, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{f.idea?.title || "—"}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {f.idea_owner?.user?.name || "—"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {f.gantt_name || "—"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {f.task_name || "—"}
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {f.requested_amount} $
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {f.justification || "—"}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusText(f.status).color}`}>
                        {getStatusText(f.status).text}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(f.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleOpenEvaluation(f)}
                        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium text-sm transition-colors"
                      >
                        تقييم
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد طلبات تمويل</h3>
          <p className="text-gray-600">لم يتم تقديم أي طلبات تمويل حتى الآن</p>
        </div>
      )}

      {/* Evaluation Modal */}
      {selectedFunding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedFunding(null)}>
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">تقييم طلب التمويل #{selectedFunding.id}</h3>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">الفكرة</h4>
                  <p className="text-gray-900">{selectedFunding.idea?.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">المرحلة</h4>
                  <p className="text-gray-900">{selectedFunding.gantt_name || "—"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">المهمة</h4>
                  <p className="text-gray-900">{selectedFunding.task_name || "—"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">المبلغ المطلوب</h4>
                  <p className="text-gray-900 font-bold">{selectedFunding.requested_amount} $</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">المبرر</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedFunding.justification || "لا يوجد مبرر"}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">❖ قرار الموافقة</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_approved"
                      checked={evaluation.is_approved}
                      onChange={(e) => setEvaluation({ ...evaluation, is_approved: e.target.checked })}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                    <label htmlFor="is_approved" className="mr-3 text-gray-700 font-medium">
                      الموافقة على طلب التمويل
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المبلغ المعتمد
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={evaluation.approved_amount}
                      onChange={(e) => setEvaluation({ ...evaluation, approved_amount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="أدخل المبلغ المعتمد..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ملاحظات اللجنة
                    </label>
                    <textarea
                      value={evaluation.committee_notes}
                      onChange={(e) => setEvaluation({ ...evaluation, committee_notes: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="أدخل ملاحظات اللجنة..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleEvaluate(selectedFunding.id)}
                  disabled={!evaluation.approved_amount}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    !evaluation.approved_amount
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  💾 حفظ التقييم
                </button>
                <button
                  onClick={() => setSelectedFunding(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium"
                >
                  ❌ إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundingRequestsTab;