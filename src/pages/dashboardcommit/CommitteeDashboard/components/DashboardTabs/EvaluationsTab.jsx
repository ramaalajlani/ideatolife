import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";

const EvaluationsTab = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showAlreadyEvaluatedModal, setShowAlreadyEvaluatedModal] = useState(false);
  const [alreadyEvaluatedIdea, setAlreadyEvaluatedIdea] = useState(null);
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
        setError("Session expired, please log in");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/committee/ideas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data);
      setIdeas(response.data.ideas || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitteeIdeas();
  }, []);

  // دالة للتحقق مما إذا كانت الفكرة مقيمة
  const isIdeaEvaluated = (idea) => {
    // تحقق من وجود initial_evaluation_score وقيمتها ليست null أو undefined أو 0
    return idea.initial_evaluation_score !== null && 
           idea.initial_evaluation_score !== undefined && 
           idea.initial_evaluation_score > 0;
  };

  const handleOpenEvaluation = (idea) => {
    // التحقق مما إذا كانت الفكرة مقيمة مسبقاً
    if (isIdeaEvaluated(idea)) {
      // عرض مودال الرسالة بدلاً من التنبيه
      setAlreadyEvaluatedIdea(idea);
      setShowAlreadyEvaluatedModal(true);
      return;
    }
    
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
      alert(err.response?.data?.message || "Failed to submit evaluation");
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
          <p className="text-slate-500 font-medium">Evaluate proposed projects and identify strengths and weaknesses</p>
        </div>
      </div>

      {/* Grid of Ideas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => {
          const isEvaluated = isIdeaEvaluated(idea);
          
          return (
            <div key={idea.id} className="bg-white rounded-[24px] border border-slate-200 p-6 hover:shadow-xl transition-all group">
              <div className="flex justify-between mb-4">
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Ref: {idea.idea_id || idea.id}
                </span>
                {isEvaluated && (
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                      Evaluated
                    </div>
                    <div className="flex items-center text-orange-600 font-bold">
                      ★ {idea.initial_evaluation_score}
                    </div>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                {idea.title}
              </h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-6">{idea.description}</p>

              <button
                onClick={() => handleOpenEvaluation(idea)}
                className={`w-full py-3 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  isEvaluated 
                    ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" 
                    : "bg-slate-900 hover:bg-orange-600"
                }`}
                disabled={isEvaluated}
              >
                {isEvaluated ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Already Evaluated
                  </>
                ) : "Start Evaluation"}
              </button>
            </div>
          );
        })}
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
                <Dialog.Panel className="w-full max-w-md bg-white rounded-[24px] shadow-2xl overflow-hidden">
                  
                  {/* Modal Header */}
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <Dialog.Title className="text-lg font-black text-slate-900">Project Evaluation</Dialog.Title>
                      <p className="text-orange-600 text-sm mt-1 truncate max-w-[250px]">{selectedIdea?.title}</p>
                    </div>
                    <button onClick={() => setShowEvaluationModal(false)} className="p-1 hover:bg-white rounded-full transition-colors text-slate-400">
                      ✕
                    </button>
                  </div>

                  <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    {/* Score Input */}
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-1">
                        Score (0-100) - Enter the numerical score from 0 to 100
                      </label>
                      <input
                        type="number"
                        min="0" max="100"
                        value={evaluationData.evaluation_score}
                        onChange={(e) => setEvaluationData({...evaluationData, evaluation_score: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-center font-bold text-lg"
                      />
                    </div>

                    {/* Summary */}
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-1">
                        Evaluation Summary - Provide a general overview of the project
                      </label>
                      <textarea
                        value={evaluationData.description}
                        onChange={(e) => setEvaluationData({...evaluationData, description: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-slate-300 min-h-[80px]"
                        placeholder="Enter a general summary..."
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Strengths */}
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-1">
                          Strengths - List the project's advantages and strong points
                        </label>
                        <textarea
                          value={evaluationData.strengths}
                          onChange={(e) => setEvaluationData({...evaluationData, strengths: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-slate-300 min-h-[80px]"
                          placeholder="List strengths..."
                        />
                      </div>
                      {/* Weaknesses */}
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-1">
                          Weaknesses - Identify areas that need improvement or pose risks
                        </label>
                        <textarea
                          value={evaluationData.weaknesses}
                          onChange={(e) => setEvaluationData({...evaluationData, weaknesses: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-slate-300 min-h-[80px]"
                          placeholder="List weaknesses..."
                        />
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-1">
                        Recommendations - Suggest strategic steps for development
                      </label>
                      <textarea
                        value={evaluationData.recommendations}
                        onChange={(e) => setEvaluationData({...evaluationData, recommendations: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-slate-300 min-h-[80px]"
                        placeholder="Enter recommendations..."
                      />
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button 
                      onClick={() => setShowEvaluationModal(false)}
                      className="flex-1 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-white transition-all border border-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitEvaluation}
                      disabled={submitting || !evaluationData.evaluation_score}
                      className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-xl font-bold hover:bg-orange-600 disabled:bg-slate-400 transition-all"
                    >
                      {submitting ? "Saving..." : "Submit"}
                    </button>
                  </div>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal لرسالة "مقيمة مسبقاً" */}
      <Transition appear show={showAlreadyEvaluatedModal} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setShowAlreadyEvaluatedModal(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md bg-white rounded-[24px] shadow-2xl overflow-hidden">
                  
                  {/* Modal Header */}
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <Dialog.Title className="text-lg font-black text-slate-900">Already Evaluated</Dialog.Title>
                        <p className="text-orange-600 text-sm mt-1 truncate max-w-[250px]">{alreadyEvaluatedIdea?.title}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowAlreadyEvaluatedModal(false)} className="p-1 hover:bg-white rounded-full transition-colors text-slate-400">
                      ✕
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="text-center">
                        <div className="text-4xl font-black text-green-600 mb-2">
                          {alreadyEvaluatedIdea?.initial_evaluation_score}
                        </div>
                        <div className="text-slate-500 font-medium">Evaluation Score</div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">This project has been evaluated</h4>
                          <p className="text-slate-600 text-sm">
                            You cannot re-evaluate a project that has already been evaluated. 
                            The evaluation score and feedback have been submitted and recorded.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <button 
                      onClick={() => setShowAlreadyEvaluatedModal(false)}
                      className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all"
                    >
                      Close
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