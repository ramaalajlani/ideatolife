import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Check, X, AlertCircle, Clock, User, FileText, DollarSign, Filter } from "lucide-react";

function WithdrawalRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'processed'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: "approved",
    penalty_amount: 0,
    committee_notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchWithdrawalRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("committee_token");
      if (!token) {
        navigate("/login/committee-member");
        return;
      }
      const response = await axios.get(
        "http://127.0.0.1:8000/api/committee/withdrawal-requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // استخدام المفتاح الصحيح requests بدل withdrawals
      setRequests(response.data.requests || []);
    } catch (err) {
      console.error("Error fetching withdrawal requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalRequests();
  }, []);

  const handleReviewClick = (request) => {
    setSelectedRequest(request);
    setReviewData({
      status: "approved",
      penalty_amount: 0,
      committee_notes: "",
    });
    setModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedRequest) return;
    try {
      setSubmitting(true);
      const token = localStorage.getItem("committee_token");
      await axios.post(
        `http://127.0.0.1:8000/api/committee/withdrawals/${selectedRequest.id}/review`,
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalOpen(false);
      fetchWithdrawalRequests();
    } catch (err) {
      alert(err.response?.data?.message || "حدث خطأ أثناء التحديث");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === "pending") return req.status === "pending";
    if (filter === "processed") return req.status !== "pending";
    return true;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-700 border-orange-200";
      case "approved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
        <p className="text-gray-500 animate-pulse">جاري جلب الطلبات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Withdrawal Requests</h1>
          <p className="text-slate-500 mt-1 font-medium">إدارة طلبات انسحاب المشاريع والغرامات المترتبة</p>
        </div>

        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          {["all", "pending", "processed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === type ? "bg-orange-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {type === "all" ? "الكل" : type === "pending" ? "قيد الانتظار" : "تمت معالجتها"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cards */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="text-slate-300" />
          </div>
          <h3 className="text-slate-900 font-bold">لا يوجد طلبات</h3>
          <p className="text-slate-400 text-sm">لم يتم العثور على طلبات انسحاب ضمن هذا التصنيف</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRequests.map((req) => (
            <div key={req.id} className="group bg-white rounded-3xl border border-slate-200 p-6 hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(req.status)}`}>
                  {req.status}
                </span>
                <div className="flex items-center text-slate-400 text-xs font-medium">
                  <Clock size={14} className="mr-1" />
                  {new Date(req.created_at).toLocaleDateString("en-GB")}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors leading-tight">
                {req.idea.title}
              </h3>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-slate-600">
                  <User size={16} className="text-orange-500 mr-2" />
                  <span className="text-sm font-semibold">{req.requester.name}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 italic">
                    "{req.reason || "لا يوجد سبب مذكور للانسحاب"}"
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                {req.status === "pending" ? (
                  <button
                    onClick={() => handleReviewClick(req)}
                    className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                  >
                    <FileText size={18} /> اتخاذ قرار
                  </button>
                ) : (
                  <div className="flex w-full items-center justify-between text-slate-400 text-sm font-bold bg-slate-50 p-3 rounded-xl">
                    <span>Penalty: ${req.penalty_amount || 0}</span>
                    <Check size={18} className="text-emerald-500" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal التقييم */}
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-lg p-8 bg-white rounded-[32px] shadow-2xl">
                  <div className="flex justify-between items-start mb-6">
                    <Dialog.Title className="text-2xl font-black text-slate-900">حسم طلب الانسحاب</Dialog.Title>
                    <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3">
                      <AlertCircle className="text-orange-500 shrink-0" />
                      <p className="text-sm text-orange-800 font-medium">أنت بصدد معالجة طلب انسحاب للمشروع "{selectedRequest?.idea.title}". هذا القرار نهائي.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">القرار</label>
                        <select
                          value={reviewData.status}
                          onChange={(e) => setReviewData({ ...reviewData, status: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="approved">قبول الانسحاب</option>
                          <option value="rejected">رفض الانسحاب</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">الغرامة ($)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3.5 text-slate-400" size={16} />
                          <input
                            type="number"
                            value={reviewData.penalty_amount}
                            onChange={(e) => setReviewData({ ...reviewData, penalty_amount: Number(e.target.value) })}
                            className="w-full bg-slate-50 border-none rounded-2xl pl-10 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">ملاحظات اللجنة</label>
                      <textarea
                        value={reviewData.committee_notes}
                        onChange={(e) => setReviewData({ ...reviewData, committee_notes: e.target.value })}
                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-orange-500 min-h-[100px]"
                        placeholder="اكتب مبررات القرار أو توجيهات لصاحب الفكرة..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button onClick={() => setModalOpen(false)} className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all">إلغاء</button>
                      <button
                        onClick={handleSubmitReview}
                        disabled={submitting}
                        className="flex-[2] bg-orange-500 text-white px-6 py-4 rounded-2xl font-black shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                      >
                        {submitting ? "جاري الإرسال..." : "تأكيد ومعالجة"}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default WithdrawalRequests;
