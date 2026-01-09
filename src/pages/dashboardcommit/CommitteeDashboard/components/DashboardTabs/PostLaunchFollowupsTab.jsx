import React, { useEffect, useState } from "react";
import axios from "axios";

const PostLaunchFollowupsTab = () => {
  const [allFollowups, setAllFollowups] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModalId, setOpenModalId] = useState(null);

  const token = localStorage.getItem("committee_token");

  const initialEvaluationState = {
    evaluation_score: "",
    strengths: "",
    weaknesses: "",
    recommendations: "",
    performance_status: "",
    risk_level: "",
    risk_description: "",
    committee_decision: "",
    actions_taken: "",
    committee_notes: "",
    marketing_support_given: false,
    product_issue_detected: false,
    is_stable: false,
    graduation_date: "",
  };

  const [evaluationForms, setEvaluationForms] = useState({});

  const fetchCommitteeFollowups = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8000/api/my-post-launch-followups-commitee",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const followups = res.data.data || [];
      setAllFollowups(followups);

      const uniqueIdeasMap = {};
      followups.forEach((item) => {
        uniqueIdeasMap[item.idea.id] = item.idea;
      });
      setIdeas(Object.values(uniqueIdeasMap));

      const forms = {};
      followups.forEach((item) => {
        const f = item.followup;
        forms[f.id] = {
          ...initialEvaluationState,
          evaluation_score: f.evaluation_score || "",
          strengths: f.strengths || "",
          weaknesses: f.weaknesses || "",
          recommendations: f.recommendations || "",
          performance_status: f.performance_status || "",
          risk_level: f.risk_level || "",
          risk_description: f.risk_description || "",
          committee_decision: f.committee_decision || "",
          actions_taken: f.actions_taken || "",
          committee_notes: f.committee_notes || "",
          marketing_support_given: f.marketing_support_given || false,
          product_issue_detected: f.product_issue_detected || false,
          is_stable: f.is_stable || false,
          graduation_date: f.graduation_date || "",
        };
      });
      setEvaluationForms(forms);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch committee follow-ups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitteeFollowups();
  }, [token]);

  const filteredFollowups = selectedIdeaId
    ? allFollowups.filter((f) => f.idea.id === selectedIdeaId)
    : [];

  const handleEvaluationChange = (followupId, e) => {
    const { name, value, type, checked } = e.target;
    setEvaluationForms({
      ...evaluationForms,
      [followupId]: {
        ...evaluationForms[followupId],
        [name]: type === "checkbox" ? checked : value,
      },
    });
  };

  const submitEvaluation = async (followupId) => {
    try {
      await axios.post(
        `http://localhost:8000/api/post-launch-followups/${followupId}/submit`,
        evaluationForms[followupId],
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Evaluation submitted successfully");
      setOpenModalId(null);
      fetchCommitteeFollowups();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 font-sans">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-10 px-4 text-gray-800 font-sans" dir="ltr">
      {!selectedIdeaId ? (
        <div className="animate-fadeIn">
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-gray-900">Post-Launch Control Panel</h3>
            <p className="text-gray-500 mt-2 text-lg">Overview of projects currently in the follow-up phase.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="group bg-white border border-gray-200 rounded-2xl p-7 cursor-pointer hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden"
                onClick={() => setSelectedIdeaId(idea.id)}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:bg-blue-100"></div>
                <h4 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">{idea.title}</h4>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                   <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white uppercase">
                     {idea.owner.name.charAt(0)}
                   </div>
                   <p className="text-sm text-gray-500">Project Owner: <span className="text-gray-900 font-bold">{idea.owner.name}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-slideUp">
          <button
            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors mb-8 group"
            onClick={() => setSelectedIdeaId(null)}
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Projects List
          </button>

          <div className="flex justify-between items-center mb-10 border-b pb-8 border-gray-100">
            <h3 className="text-4xl font-bold text-gray-900">Timeline & Milestones</h3>
            <span className="px-5 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold">
              {filteredFollowups.length} Evaluation Cycles
            </span>
          </div>

          <div className="space-y-12">
            {filteredFollowups.map((item) => {
              const f = item.followup;
              const form = evaluationForms[f.id] || initialEvaluationState;
              const evaluationDone = f.status === "done" && f.committee_decision;

              return (
                <div key={f.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Phase Banner */}
                  <div className="bg-gray-50 px-10 py-5 border-b border-gray-100 flex justify-between items-center">
                     <div className="flex items-center gap-4">
                        <span className="font-bold text-blue-600 text-sm uppercase">Phase: {f.phase.replace('_', ' ')}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs text-gray-500 uppercase">Scheduled: {f.scheduled_date}</span>
                     </div>
                     <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border ${evaluationDone ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                       {evaluationDone ? 'Reviewed' : 'Awaiting Review'}
                     </span>
                  </div>

                  <div className="p-10">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                      <div className="space-y-4">
                        <h5 className="text-xs font-bold text-gray-400 uppercase">Growth Metrics</h5>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm"><span className="text-gray-500">Active Users</span> <span className="font-bold">{f.active_users}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-500">Revenue</span> <span className="font-bold text-gray-900">${f.revenue}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-500">Growth</span> <span className="font-bold text-green-600">+{f.growth_rate}%</span></div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-xs font-bold text-gray-400 uppercase">Status Tracking</h5>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm"><span className="text-gray-500">Performance</span> <span className="font-bold capitalize">{f.performance_status || "N/A"}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-500">Risk Level</span> <span className={`font-bold capitalize ${f.risk_level === 'high' ? 'text-red-600' : 'text-gray-700'}`}>{f.risk_level || "Low"}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-500">Stability</span> <span className={`font-bold ${f.is_stable ? 'text-green-600' : 'text-amber-500'}`}>{f.is_stable ? "Stable" : "Unstable"}</span></div>
                        </div>
                      </div>

                      {/* Info Column */}
                      <div className="lg:col-span-2 grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div>
                          <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Reviewer</h5>
                          <p className="text-sm font-bold text-gray-800">{f.reviewed_by?.name || "System"}</p>
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Graduation</h5>
                          <p className="text-sm font-bold text-gray-800">{f.graduation_date || "Not Set"}</p>
                        </div>
                        <div className="col-span-2">
                          <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Owner Acknowledgment</h5>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${f.owner_acknowledged ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            <span className="text-xs font-bold text-gray-600">{f.owner_acknowledged ? "Acknowledged by Owner" : "Pending Acknowledgment"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Notes */}
                    <div className="mt-10 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-5 border border-gray-100 rounded-xl">
                           <label className="text-xs font-bold text-blue-500 uppercase mb-2 block">Actions Taken</label>
                           <p className="text-sm text-gray-700 leading-relaxed">{f.actions_taken || "No actions documented yet."}</p>
                        </div>
                        <div className="p-5 border border-gray-100 rounded-xl bg-amber-50/30">
                           <label className="text-xs font-bold text-amber-600 uppercase mb-2 block">Owner Response</label>
                           <p className="text-sm text-gray-700 leading-relaxed italic">"{f.owner_response || "Waiting for owner feedback..."}"</p>
                        </div>
                      </div>

                      <div className="p-6 bg-gray-900 rounded-2xl text-white">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Committee Final Decision</label>
                        </div>
                        <p className="text-lg font-bold capitalize">{f.committee_decision ? f.committee_decision.replace('_', ' ') : "Decision Pending"}</p>
                        <p className="text-sm text-gray-400 mt-2">{f.committee_notes || "Internal committee notes will appear here after review."}</p>
                      </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end">
                      {!evaluationDone ? (
                        <button
                          className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                          onClick={() => setOpenModalId(f.id)}
                        >
                          Perform Evaluation
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-6 py-3 rounded-xl border border-green-100">
                           <span className="text-xs font-bold uppercase">Review Finalized</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MODAL */}
                  {openModalId === f.id && (
                    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-md flex justify-center items-center z-50 p-6">
                      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-12">
                          <div className="flex justify-between items-start mb-10">
                            <div>
                              <h4 className="text-2xl font-bold text-gray-900">Technical Evaluation</h4>
                              <p className="text-gray-500 text-sm mt-1 italic">Cycle: {f.phase}</p>
                            </div>
                            <button onClick={() => setOpenModalId(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">✕</button>
                          </div>

                          <div className="space-y-6">
                            {/* Score */}
                            <div>
                              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Evaluation Score (0-100)</label>
                              <input 
                                type="number" 
                                name="evaluation_score" 
                                value={form.evaluation_score} 
                                onChange={(e) => handleEvaluationChange(f.id, e)} 
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-base font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                                min="0" 
                                max="100" 
                              />
                            </div>

                            {/* Strengths, Weaknesses, Recommendations */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Strengths</label>
                                <textarea 
                                  name="strengths" 
                                  value={form.strengths} 
                                  onChange={(e) => handleEvaluationChange(f.id, e)} 
                                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm min-h-[120px] outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                                />
                              </div>

                              <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Weaknesses</label>
                                <textarea 
                                  name="weaknesses" 
                                  value={form.weaknesses} 
                                  onChange={(e) => handleEvaluationChange(f.id, e)} 
                                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm min-h-[120px] outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Recommendations</label>
                                <textarea 
                                  name="recommendations" 
                                  value={form.recommendations} 
                                  onChange={(e) => handleEvaluationChange(f.id, e)} 
                                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                                />
                              </div>
                            </div>

                            {/* Performance Status */}
                            <div>
                              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Performance Status</label>
                              <select 
                                name="performance_status" 
                                value={form.performance_status} 
                                onChange={(e) => handleEvaluationChange(f.id, e)} 
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                              >
                                <option value="">Select Performance Status</option>
                                <option value="excellent">Excellent</option>
                                <option value="good">Good</option>
                                <option value="stable">Stable</option>
                                <option value="needs_improvement">Needs Improvement</option>
                                <option value="poor">Poor</option>
                              </select>
                            </div>

                            {/* Risk Level & Description */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Risk Level</label>
                                <select 
                                  name="risk_level" 
                                  value={form.risk_level} 
                                  onChange={(e) => handleEvaluationChange(f.id, e)} 
                                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                >
                                  <option value="">Select Risk Level</option>
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Risk Description</label>
                                <textarea 
                                  name="risk_description" 
                                  value={form.risk_description} 
                                  onChange={(e) => handleEvaluationChange(f.id, e)} 
                                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm min-h-[80px] outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                                />
                              </div>
                            </div>

                            {/* Actions Taken */}
                            <div>
                              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Actions Taken</label>
                              <textarea 
                                name="actions_taken" 
                                value={form.actions_taken} 
                                onChange={(e) => handleEvaluationChange(f.id, e)} 
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                              />
                            </div>

                            {/* Committee Notes */}
                            <div>
                              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Committee Notes</label>
                              <textarea 
                                name="committee_notes" 
                                value={form.committee_notes} 
                                onChange={(e) => handleEvaluationChange(f.id, e)} 
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                              />
                            </div>

                            {/* Checkboxes */}
                            <div className="md:col-span-2 flex flex-wrap gap-6 bg-gray-50 p-6 rounded-2xl">
                              <label className="flex items-center gap-3 text-sm font-bold text-gray-700 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  name="marketing_support_given" 
                                  checked={form.marketing_support_given} 
                                  onChange={(e) => handleEvaluationChange(f.id, e)} 
                                  className="w-5 h-5 rounded border-gray-300 text-blue-600" 
                                /> 
                                Marketing Support Given
                              </label>
                              <label className="flex items-center gap-3 text-sm font-bold text-gray-700 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  name="product_issue_detected" 
                                  checked={form.product_issue_detected} 
                                  onChange={(e) => handleEvaluationChange(f.id, e)} 
                                  className="w-5 h-5 rounded border-gray-300 text-red-600" 
                                /> 
                                Product Issue Detected
                              </label>
                              <label className="flex items-center gap-3 text-sm font-bold text-gray-700 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  name="is_stable" 
                                  checked={form.is_stable} 
                                  onChange={(e) => handleEvaluationChange(f.id, e)} 
                                  className="w-5 h-5 rounded border-gray-300 text-green-600" 
                                /> 
                                Project Stable
                              </label>
                            </div>

                            {/* Committee Decision */}
                            <div>
                              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Committee Decision</label>
                              <select 
                                name="committee_decision" 
                                value={form.committee_decision} 
                                onChange={(e) => handleEvaluationChange(f.id, e)} 
                                className="w-full bg-blue-50 border-none rounded-xl px-5 py-4 text-sm font-bold text-blue-800 outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Decision</option>
                                <option value="continue">Continue</option>
                                <option value="extra_support">Extra Support</option>
                                <option value="pivot_required">Pivot Required</option>
                                <option value="terminate">Terminate</option>
                                <option value="graduate">Graduate</option>
                              </select>
                            </div>

                            {/* Graduation Date (if graduate) */}
                            {form.committee_decision === "graduate" && (
                              <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Graduation Date</label>
                                <input 
                                  type="date" 
                                  name="graduation_date" 
                                  value={form.graduation_date} 
                                  onChange={(e) => handleEvaluationChange(f.id, e)} 
                                  className="w-full bg-green-50 border border-green-100 rounded-xl px-5 py-3.5 text-sm font-bold text-green-800 outline-none focus:ring-2 focus:ring-green-500" 
                                />
                              </div>
                            )}
                          </div>

                          <button 
                            onClick={() => submitEvaluation(f.id)} 
                            className="w-full py-5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl mt-10 shadow-2xl active:scale-[0.98]"
                          >
                            Submit Evaluation To Owner
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostLaunchFollowupsTab;