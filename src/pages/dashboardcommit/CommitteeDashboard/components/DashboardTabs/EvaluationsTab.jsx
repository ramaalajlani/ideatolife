import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { 
  Check, 
  X, 
  Star, 
  FileText, 
  AlertCircle, 
  TrendingUp, 
  ThumbsDown, 
  Lightbulb 
} from "lucide-react";

const EvaluationsTab = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluationData, setEvaluationData] = useState({
    evaluation_score: "",
    description: "",
    strengths: "",
    weaknesses: "",
    recommendations: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCommitteeIdeas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('committee_token');
      if (!token) {
        setError("انتهت الجلسة، يرجى تسجيل الدخول");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/committee/ideas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIdeas(response.data.ideas || []);
    } catch (err) {
      setError(err.response?.data?.message || "خطأ في جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitteeIdeas();
  }, []);

  const handleOpenEvaluation = (idea) => {
    setSelectedIdea(idea);
    setEvaluationData({
      evaluation_score: idea.initial_evaluation_score || "",
      description: "",
      strengths: "",
      weaknesses: "",
      recommendations: ""
    });
    setShowEvaluationModal(true);
  };

  const handleSubmitEvaluation = async () => {
    const ideaId = selectedIdea.id || selectedIdea.idea_id;
    try {
      setSubmitting(true);
      const token = localStorage.getItem('committee_token');
      await axios.post(
        `http://localhost:8000/api/ideas/${ideaId}/evaluate`,
        {
          evaluation_score: parseInt(evaluationData.evaluation_score),
          description: evaluationData.description || "",
          strengths: evaluationData.strengths || "",
          weaknesses: evaluationData.weaknesses || "",
          recommendations: evaluationData.recommendations || ""
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShowEvaluationModal(false);
      fetchCommitteeIdeas();
    } catch (err) {
      alert(err.response?.data?.message || "فشل إرسال التقييم");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Project Evaluations</h2>
          <p className="text-slate-500 font-medium">تقييم المشاريع المطروحة وتحديد نقاط القوة والضعف</p>
        </div>
      </div>

      {/* Grid of Ideas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <div key={idea.id} className="bg-white rounded-[24px] border border-slate-200 p-6 hover:shadow-xl transition-all group">
            <div className="flex justify-between mb-4">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Ref: {idea.idea_id || idea.id}
              </span>
              {idea.initial_evaluation_score && (
                <div className="flex items-center text-orange-600 font-bold">
                  <Star size={14} className="fill-orange-600 mr-1" />
                  {idea.initial_evaluation_score}
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
              {idea.title}
            </h3>
            <p className="text-slate-500 text-sm line-clamp-2 mb-6">{idea.description}</p>

            <button
              onClick={() => handleOpenEvaluation(idea)}
              className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              {idea.initial_evaluation_score ? "تعديل التقييم" : "بدء التقييم"}
            </button>
          </div>
        ))}
      </div>

      {/* Headless UI Evaluation Modal */}
      <Transition appear show={showEvaluationModal} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setShowEvaluationModal(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden">
                  
                  {/* Modal Header */}
                  <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <Dialog.Title className="text-2xl font-black text-slate-900">تقييم المشروع</Dialog.Title>
                      <p className="text-orange-600 font-bold text-sm mt-1">{selectedIdea?.title}</p>
                    </div>
                    <button onClick={() => setShowEvaluationModal(false)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Score Input */}
                    <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-1">
                        <label className="text-sm font-black text-orange-800 uppercase tracking-widest block mb-1">الدرجة المستحقة (0-100)</label>
                        <p className="text-xs text-orange-600">حدد مدى كفاءة الفكرة بناءً على معايير اللجنة</p>
                      </div>
                      <input
                        type="number"
                        min="0" max="100"
                        value={evaluationData.evaluation_score}
                        onChange={(e) => setEvaluationData({...evaluationData, evaluation_score: e.target.value})}
                        className="w-24 px-4 py-3 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:ring-0 text-center font-black text-xl text-orange-900"
                      />
                    </div>

                    {/* Summary */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                        <FileText size={14} /> ملخص التقييم
                      </label>
                      <textarea
                        value={evaluationData.description}
                        onChange={(e) => setEvaluationData({...evaluationData, description: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-slate-200 min-h-[100px]"
                        placeholder="أدخل ملخصاً عاماً حول أداء المشروع..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Strengths */}
                      <div>
                        <label className="flex items-center gap-2 text-xs font-black text-emerald-500 uppercase tracking-widest mb-3">
                          <TrendingUp size={14} /> نقاط القوة
                        </label>
                        <textarea
                          value={evaluationData.strengths}
                          onChange={(e) => setEvaluationData({...evaluationData, strengths: e.target.value})}
                          className="w-full bg-emerald-50/30 border-emerald-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-200 min-h-[100px]"
                          placeholder="ما هي المزايا التنافسية؟"
                        />
                      </div>
                      {/* Weaknesses */}
                      <div>
                        <label className="flex items-center gap-2 text-xs font-black text-red-500 uppercase tracking-widest mb-3">
                          <ThumbsDown size={14} /> نقاط الضعف
                        </label>
                        <textarea
                          value={evaluationData.weaknesses}
                          onChange={(e) => setEvaluationData({...evaluationData, weaknesses: e.target.value})}
                          className="w-full bg-red-50/30 border-red-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-red-200 min-h-[100px]"
                          placeholder="ما هي المخاطر المحتملة؟"
                        />
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-black text-orange-500 uppercase tracking-widest mb-3">
                        <Lightbulb size={14} /> توصيات إستراتيجية
                      </label>
                      <textarea
                        value={evaluationData.recommendations}
                        onChange={(e) => setEvaluationData({...evaluationData, recommendations: e.target.value})}
                        className="w-full bg-orange-50/30 border-orange-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-orange-200 min-h-[100px]"
                        placeholder="خطوات مقترحة لتطوير الفكرة..."
                      />
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                    <button 
                      onClick={() => setShowEvaluationModal(false)}
                      className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-white transition-all border border-transparent hover:border-slate-200"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSubmitEvaluation}
                      disabled={submitting || !evaluationData.evaluation_score}
                      className="flex-[2] bg-slate-900 text-white px-6 py-4 rounded-2xl font-black shadow-lg shadow-slate-200 hover:bg-orange-600 disabled:bg-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                      {submitting ? "جاري الحفظ..." : "اعتماد التقييم النهائي"}
                    </button>
                  </div>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default EvaluationsTab;