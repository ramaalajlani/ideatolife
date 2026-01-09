import React, { useEffect, useState, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import TimelineItem from "./TimelineItem";
import { toggleAutoRefresh } from "../../store/slices/roadmapSlice.js";
import { 
  fetchIdeaRoadmap, 
  fetchPlatformStages, 
} from "../../store/slices/roadmapSlice";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import axios from "axios"; // أضفنا axios للتعامل مع طلبات الحالة
import { 
  ArrowLeft, 
  RefreshCw, 
  ArrowRight,
  Clock,
  Zap,
  AlertTriangle,
  X,
  Send,
  History,
  CreditCard,
  CheckCircle2
} from "lucide-react";
import withdrawalService from "../../services/withdrawalService"; 

// استيراد الأنيميشنات
import ideaAnimation from '../../assets/animations/Worker have an Idea.json';
import evaluationAnimation from '../../assets/animations/Discussion.json';
import planningAnimation from '../../assets/animations/Planning Schedule (1).json';
import fundingAnimation from '../../assets/animations/funding ideas.json';
import webDev1Animation from '../../assets/animations/Web Development (1).json';
import webDevAnimation from '../../assets/animations/web development.json';
import lunchApp from '../../assets/animations/Forked Project (1).json';
import followUP from '../../assets/animations/Forked Project (1).json';

const timelineAnimations = {
  "Idea Submission": ideaAnimation,
  "Initial Evaluation": evaluationAnimation,
  "Systematic Planning / Business Plan Preparation": planningAnimation,
  "Advanced Evaluation Before Funding": evaluationAnimation,
  "Funding": fundingAnimation,
  "Execution and Development": webDevAnimation,
  "Launch": webDev1Animation,
  "Post-Launch Follow-up": followUP,
  "Project Stabilization / Platform Separation": lunchApp
};

const Timeline = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // حالات الـ Modal والانسحاب
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); // مودال تاريخ الطلبات
  const [withdrawalReason, setWithdrawalReason] = useState("");
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [executingPay, setExecutingPay] = useState(false);
  
  // حالة طلبات الانسحاب من السيرفر
  const [myWithdrawals, setMyWithdrawals] = useState([]);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  // قراءة الحالة من Redux
  const { 
    roadmapInfo,
    timelineData,
    loading,
    error,
    lastUpdated,
    autoRefreshEnabled
  } = useSelector(state => state.roadmap);

  // جلب طلبات الانسحاب الخاصة بالمستخدم
  const fetchWithdrawalStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/withdrawals", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const withdrawals = response.data.withdrawals || [];
      setMyWithdrawals(withdrawals);
      
      // التحقق لو في طلب لسا Pending لهذه الفكرة
      const pending = withdrawals.find(w => w.request.idea_id == ideaId && w.committee_response.status === 'pending');
      setHasPendingRequest(!!pending);
    } catch (err) {
      console.error("Error fetching withdrawal status", err);
    }
  };

  useEffect(() => {
    let intervalId;
    
    const loadData = () => {
      if (ideaId) {
        dispatch(fetchIdeaRoadmap(ideaId));
        fetchWithdrawalStatus();
      } else {
        dispatch(fetchPlatformStages());
      }
    };

    loadData();

    if (autoRefreshEnabled) {
      intervalId = setInterval(() => {
        loadData();
      }, 30000); 
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [ideaId, dispatch, autoRefreshEnabled]);

  const enhancedTimelineData = timelineData.map(item => ({
    ...item,
    animation: timelineAnimations[item.stage_name] || timelineAnimations["Idea Submission"]
  }));

  const handleManualRefresh = () => {
    if (ideaId) {
      dispatch(fetchIdeaRoadmap(ideaId));
      fetchWithdrawalStatus();
    } else {
      dispatch(fetchPlatformStages());
    }
  };

  const handleBack = () => {
    if (ideaId) {
      navigate(`/profile`);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmWithdrawal = async () => {
    if (!withdrawalReason.trim()) return;
    try {
      setWithdrawalLoading(true);
      await withdrawalService.requestWithdrawal(ideaId, withdrawalReason);
      setWithdrawalLoading(false);
      setIsWithdrawModalOpen(false);
      setWithdrawalReason("");
      fetchWithdrawalStatus();
      alert("Withdrawal request submitted successfully.");
    } catch (error) {
      alert("Failed to submit withdrawal request.");
      setWithdrawalLoading(false);
    }
  };

  // تنفيذ دفع الغرامة والانسحاب النهائي
  const handleExecutePayment = async (withdrawalId) => {
    try {
      setExecutingPay(true);
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:8000/api/withdrawals/${withdrawalId}/execute`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Withdrawal executed successfully and penalty paid.");
      setIsHistoryModalOpen(false);
      fetchWithdrawalStatus();
      dispatch(fetchIdeaRoadmap(ideaId)); // تحديث الخريطة لتظهر كمسحوبة
    } catch (err) {
      alert(err.response?.data?.message || "Failed to execute payment");
    } finally {
      setExecutingPay(false);
    }
  };

  if (loading && timelineData.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner message="Loading roadmap..." />
      </div>
    );
  }

  if (error && enhancedTimelineData.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage message={error} onRetry={handleManualRefresh} />
          <button 
            onClick={handleBack} 
            className="w-full mt-4 py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-lg font-medium transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const getTimeSinceUpdate = () => {
    if (!lastUpdated) return "Never";
    const now = new Date();
    const lastUpdate = new Date(lastUpdated);
    const diffInSeconds = Math.floor((now - lastUpdate) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header & Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBack} 
                className="flex items-center gap-2 px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <button 
                onClick={handleManualRefresh} 
                className="flex items-center gap-2 px-4 py-2 bg-[#A3DC9A] hover:bg-[#8CC084] text-gray-800 rounded-lg transition-colors shadow-sm"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="font-medium">Refresh Now</span>
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <div className="flex items-center gap-2 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg border border-gray-200">
                  <Clock className="w-4 h-4" />
                  <div>
                    <div className="text-xs">Last updated</div>
                    <div className="text-sm font-medium">{getTimeSinceUpdate()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[#FFD586] to-[#FFE8A5] rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Project Roadmap</h1>
                
                <div className="flex flex-wrap gap-2 mb-3">
                   {/* زر الانسحاب - يتغير حالته لو كان هناك طلب معلق */}
                  {ideaId && (
                    <button 
                      onClick={() => !hasPendingRequest && setIsWithdrawModalOpen(true)}
                      disabled={hasPendingRequest}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                        hasPendingRequest 
                        ? "bg-amber-100 text-amber-700 border-amber-200 cursor-not-allowed" 
                        : "bg-red-500/10 text-red-700 border-red-200 hover:bg-red-500 hover:text-white"
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      {hasPendingRequest ? "Waiting for Committee Decision..." : "Request Withdrawal"}
                    </button>
                  )}

                  {/* زر سجل طلبات الانسحاب */}
                  {ideaId && (
                    <button 
                      onClick={() => setIsHistoryModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-1.5 bg-slate-800 text-white hover:bg-slate-900 rounded-full text-sm font-semibold transition-all duration-300"
                    >
                      <History className="w-4 h-4" />
                      Withdrawal Requests & Results
                    </button>
                  )}
                </div>

                {roadmapInfo ? (
                  <p className="text-gray-600 text-lg">{roadmapInfo.title}</p>
                ) : (
                  <p className="text-gray-600 text-lg">Platform Roadmap Stages</p>
                )}
              </div>
              
              {roadmapInfo?.roadmap && (
                <div className="bg-gradient-to-r from-[#FFE8D6] to-[#D4F1C5] rounded-xl p-4 border border-[#FFD6BA] text-center shadow-inner">
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {roadmapInfo.roadmap.progress_percentage}%
                  </div>
                  <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Current Progress</div>
                </div>
              )}
            </div>
            
            {roadmapInfo?.roadmap && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-[#FFF9BD] shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Current Stage</div>
                  <div className="font-semibold text-gray-800">{roadmapInfo.roadmap.current_stage}</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-[#FFD6BA] shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                  <div className="font-semibold text-gray-800">
                    {new Date(roadmapInfo.roadmap.last_update).toLocaleDateString('en-US')}
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-[#A3DC9A] shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Next Step</div>
                  <div className="font-semibold text-gray-800">{roadmapInfo.roadmap.next_step || 'None'}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="relative my-16 flex flex-col">
          <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 flex flex-col items-center w-32">
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-l-xl shadow-2xl border-r-2 border-gray-600"></div>
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-r-xl shadow-2xl border-l-2 border-gray-600"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-between py-8">
              {enhancedTimelineData.map((item, idx) => (
                <div key={item.id} className="relative w-full flex justify-center my-8">
                  <div 
                    className="w-20 h-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-110 cursor-pointer"
                    style={{ 
                      background: `linear-gradient(90deg, #8c8c8c 0%, #b0b0b0 50%, #8c8c8c 100%)`, 
                      boxShadow: `0 4px 8px rgba(0,0,0,0.3)` 
                    }}
                  >
                    {item.progress > 0 && (
                      <div className="h-full rounded-lg bg-white/30 transition-all duration-1000" style={{ width: `${item.progress}%` }}></div>
                    )}
                    <div className="absolute inset-0 rounded-lg flex items-center justify-center" style={{ background: `repeating-linear-gradient(90deg, transparent, transparent 4px, white 4px, white 8px)` }}></div>
                  </div>
                  <div 
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border-3 border-white shadow-xl flex items-center justify-center z-30" 
                    style={{ backgroundColor: item.colors.main }}
                  >
                    <span className="text-gray-800 font-bold text-base">{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-400 to-gray-600 shadow-lg"></div>
            <div className="absolute right-6 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-400 to-gray-600 shadow-lg"></div>
          </div>

          {enhancedTimelineData.map((data, idx) => (
            <TimelineItem 
              data={data} 
              key={data.id} 
              index={idx} 
              roadmapInfo={roadmapInfo} 
              ideaId={ideaId} 
              language="en" 
              allStages={enhancedTimelineData} 
            />
          ))}
        </div>

        {/* Withdrawal Modal */}
        <Transition show={isWithdrawModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-[100]" onClose={() => setIsWithdrawModalOpen(false)}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200">
              <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95 translate-y-4" enterTo="opacity-100 scale-100 translate-y-0" leave="ease-in duration-200">
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all border border-gray-100">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                      <button onClick={() => setIsWithdrawModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X className="w-6 h-6" /></button>
                    </div>
                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 mb-2">Withdraw Idea?</Dialog.Title>
                    <p className="text-gray-500 mb-6">This action will initiate the process of withdrawing your idea. Please provide a reason.</p>
                    <textarea
                      rows={4}
                      value={withdrawalReason}
                      onChange={(e) => setWithdrawalReason(e.target.value)}
                      placeholder="Please provide a detailed reason..."
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none resize-none"
                    />
                    <div className="mt-8 grid grid-cols-2 gap-3">
                      <button onClick={() => setIsWithdrawModalOpen(false)} className="px-6 py-3.5 rounded-2xl bg-gray-50 font-bold text-gray-700">Discard</button>
                      <button 
                        disabled={withdrawalLoading || !withdrawalReason.trim()}
                        onClick={handleConfirmWithdrawal}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300"
                      >
                        {withdrawalLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" />Submit</>}
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Withdrawal History & Results Modal (New) */}
        <Transition show={isHistoryModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-[101]" onClose={() => setIsHistoryModalOpen(false)}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200">
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200">
                  <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl transition-all border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <Dialog.Title as="h3" className="text-2xl font-black text-slate-900">Withdrawal Requests</Dialog.Title>
                        <p className="text-slate-500 font-medium">History and decisions of the committee</p>
                      </div>
                      <button onClick={() => setIsHistoryModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
                    </div>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      {myWithdrawals.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                          <History className="mx-auto w-12 h-12 text-slate-300 mb-4" />
                          <p className="text-slate-500 font-bold">No withdrawal requests found.</p>
                        </div>
                      ) : (
                        myWithdrawals.map((item, idx) => (
                          <div key={idx} className="bg-white border border-slate-200 rounded-[24px] p-6 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                                  item.committee_response.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                  item.committee_response.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {item.committee_response.status}
                                </div>
                                <span className="text-xs font-bold text-slate-400">{item.request.created_at}</span>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <p className="text-xs font-black text-slate-400 uppercase mb-1">Your Reason:</p>
                              <p className="text-slate-700 text-sm font-medium">{item.request.reason}</p>
                            </div>

                            {item.committee_response.status !== 'pending' && (
                              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Committee Notes:</p>
                                  <p className="text-slate-600 text-sm italic">"{item.committee_response.committee_notes || 'No notes provided'}"</p>
                                </div>
                                
                                {item.committee_response.status === 'approved' && (
                                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                                    <div className="flex justify-between items-center mb-2">
                                      <p className="text-[10px] font-black text-orange-400 uppercase">Penalty Amount:</p>
                                      {item.committee_response.penalty_paid && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                          <CheckCircle2 size={12} /> Paid
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xl font-black text-orange-700">${item.committee_response.penalty_amount}</p>
                                    
                                    {!item.committee_response.penalty_paid && (
                                      <button 
                                        disabled={executingPay}
                                        onClick={() => handleExecutePayment(item.request.id)}
                                        className="w-full mt-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95"
                                      >
                                        {executingPay ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><CreditCard size={14} /> Pay & Withdraw Now</>}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Navigation Legend */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Navigate:</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-yellow-600 font-bold">●</span></div>
              <div><h4 className="font-medium text-gray-800">Current Stage</h4><p className="text-sm text-gray-600 mt-1">The highlighted stage is active</p></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-green-600 font-bold">✓</span></div>
              <div><h4 className="font-medium text-gray-800">Completed</h4><p className="text-sm text-gray-600 mt-1">Stages marked with check marks</p></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"><ArrowRight className="w-4 h-4 text-blue-600" /></div>
              <div><h4 className="font-medium text-gray-800">Next Step</h4><p className="text-sm text-gray-600 mt-1">Indicates the upcoming milestone</p></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0"><RefreshCw className="w-4 h-4 text-gray-600" /></div>
              <div><h4 className="font-medium text-gray-800">Sync</h4><p className="text-sm text-gray-600 mt-1">Data refreshes every 30 seconds</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;