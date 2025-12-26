import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import fundingService from "../services/fundingService";
import axios from 'axios';

const FundingRequestsCard = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("fundingRequests");
  const [showFundingForm, setShowFundingForm] = useState(false);
  const [formData, setFormData] = useState({
    requested_amount: "",
    justification: ""
  });
  const [cancellationData, setCancellationData] = useState({
    cancellation_reason: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [fundingData, setFundingData] = useState(null);
  const [fundingRequirements, setFundingRequirements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFundingId, setSelectedFundingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // جلب بيانات التمويل
  useEffect(() => {
    const loadFundingData = async () => {
      if (!ideaId) {
        setError('لم يتم تحديد فكرة');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // جلب بيانات التمويل
        const response = await fundingService.getFundingForIdea(ideaId);
        setFundingData(response);
        
        // جلب بيانات الأهلية
        const eligibility = await fundingService.checkFundingEligibility(ideaId);
        setFundingRequirements(eligibility);
        
      } catch (error) {
        console.error('Error loading funding data:', error);
        setError(error.message || 'حدث خطأ في تحميل بيانات التمويل');
      } finally {
        setLoading(false);
      }
    };

    loadFundingData();
  }, [ideaId]);

  const handleSubmitFunding = async (e) => {
    e.preventDefault();
    
    if (!ideaId) {
      alert('❌ يرجى اختيار فكرة أولاً');
      return;
    }

    if (!formData.requested_amount || parseFloat(formData.requested_amount) <= 0) {
      alert('❌ يرجى إدخال مبلغ صحيح');
      return;
    }

    if (!formData.justification.trim()) {
      alert('❌ يرجى كتابة مبررات التمويل');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fundingService.requestFunding(ideaId, {
        requested_amount: parseFloat(formData.requested_amount),
        justification: formData.justification
      });
      
      alert(`✅ ${response.message || 'تم تقديم طلب التمويل بنجاح!'}`);
      
      // تحديث البيانات
      const updatedData = await fundingService.getFundingForIdea(ideaId);
      setFundingData(updatedData);
      
      // إعادة تعيين النموذج
      setFormData({ requested_amount: "", justification: "" });
      setShowFundingForm(false);
      
    } catch (error) {
      console.error('Error submitting funding request:', error);
      
      if (error.message?.includes('صلاحية')) {
        alert(`❌ ${error.message}`);
      } else if (error.message?.includes('خطة العمل')) {
        alert(`❌ ${error.message}`);
      } else if (error.message?.includes('تقييم')) {
        alert(`❌ ${error.message}`);
      } else if (error.message?.includes('طلب تمويل جديد')) {
        alert(`❌ ${error.message}`);
      } else if (error.message) {
        alert(`❌ ${error.message}`);
      } else {
        alert('❌ حدث خطأ أثناء تقديم طلب التمويل');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelFunding = async () => {
    if (!selectedFundingId) return;
    
    setIsCancelling(true);
    try {
      const response = await fundingService.cancelFunding(
        selectedFundingId,
        { cancellation_reason: cancellationData.cancellation_reason }
      );
      
      alert(`✅ ${response.message || 'تم إلغاء طلب التمويل بنجاح!'}`);
      
      // تحديث البيانات
      const updatedData = await fundingService.getFundingForIdea(ideaId);
      setFundingData(updatedData);
      
      // إعادة تعيين
      setShowCancelModal(false);
      setSelectedFundingId(null);
      setCancellationData({ cancellation_reason: "" });
      
    } catch (error) {
      console.error('Error cancelling funding:', error);
      
      if (error.message?.includes('صلاحية')) {
        alert(`❌ ${error.message}`);
      } else if (error.message?.includes('لا يمكن إلغاء')) {
        alert(`❌ ${error.message}`);
      } else if (error.message) {
        alert(`❌ ${error.message}`);
      } else {
        alert('❌ حدث خطأ أثناء إلغاء طلب التمويل');
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCancelReasonChange = (e) => {
    setCancellationData({
      cancellation_reason: e.target.value
    });
  };

  const openCancelModal = (fundingId) => {
    setSelectedFundingId(fundingId);
    setShowCancelModal(true);
  };

  // إذا كان في حالة تحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل بيانات التمويل...</p>
        </div>
      </div>
    );
  }

  // إذا كان هناك خطأ
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/ideas')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            العودة إلى قائمة الأفكار
          </button>
        </div>
      </div>
    );
  }

  // إذا لم توجد بيانات تمويل
  if (!fundingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-3">لا توجد بيانات تمويل</h2>
          <p className="text-gray-600 mb-6">
            لا توجد طلبات تمويل لهذه الفكرة بعد.
          </p>
          <button
            onClick={() => navigate(`/ideas/${ideaId}`)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            عرض الفكرة
          </button>
        </div>
      </div>
    );
  }

  const { fundings, idea_title } = fundingData;

  // Funding Requests Tab Content
  const renderFundingRequests = () => (
    <div className="space-y-8">
      {/* New Funding Request Section */}
      <div className="bg-white rounded-2xl shadow-2xl border border-orange-200 overflow-hidden">
        <div className="bg-gradient-to-r from-black to-gray-900 text-white p-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold tracking-tight">NEW FUNDING REQUEST</div>
              <div className="text-sm text-orange-300 mt-1">Submit Your Funding Application</div>
            </div>
            <button
              onClick={() => setShowFundingForm(!showFundingForm)}
              disabled={fundings?.some(f => f.status === 'requested' || f.status === 'under_review')}
              className={`px-6 py-3 ${
                fundings?.some(f => f.status === 'requested' || f.status === 'under_review')
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              } text-white rounded-lg font-semibold transition-all duration-200 shadow-md`}
            >
              {showFundingForm ? "Cancel Application" : "Apply for Funding"}
            </button>
          </div>
        </div>

        {showFundingForm ? (
          <div className="p-8">
            <form onSubmit={handleSubmitFunding} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Requested Amount (SYP)
                  </label>
                  <input
                    type="number"
                    name="requested_amount"
                    value={formData.requested_amount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Enter amount in SYP"
                    required
                    min="1"
                    step="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Project Idea
                  </label>
                  <div className="px-4 py-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="font-semibold text-gray-800">{idea_title}</div>
                    <div className="text-sm text-gray-600 mt-1">الفكرة #{ideaId}</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Justification for Funding
                </label>
                <textarea
                  name="justification"
                  value={formData.justification}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="Explain why you need this funding and how it will be used..."
                  required
                  maxLength="1000"
                />
                <div className="text-sm text-orange-600 mt-2">
                  {formData.justification.length}/1000 characters
                </div>
              </div>

              {/* Requirements Check */}
              {fundingRequirements && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="text-lg font-semibold text-green-800 mb-4">Application Requirements</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className={`w-2 h-2 rounded-full ${fundingRequirements.business_plan_completed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700">Business Plan Completed</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className={`w-2 h-2 rounded-full ${fundingRequirements.minimum_score_achieved ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700">Minimum Score Achieved</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className={`w-2 h-2 rounded-full ${fundingRequirements.no_pending_requests ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700">No Pending Requests</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className={`w-2 h-2 rounded-full ${fundingRequirements.committee_assigned ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700">Committee Assigned</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className={`w-2 h-2 rounded-full ${fundingRequirements.investor_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700">Investor Available</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-gray-700">Score: {fundingRequirements.business_plan_score}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFundingForm(false)}
                  className="px-8 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 ${
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                  } text-white rounded-lg font-semibold transition-all duration-200 shadow-md`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Funding Request'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-600 text-lg mb-6">
              {fundings?.some(f => f.status === 'requested' || f.status === 'under_review')
                ? 'لديك طلب تمويل قيد المراجعة حالياً.'
                : 'Ready to take your project to the next level? Apply for funding now.'}
            </div>
            {fundingRequirements && (
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8 max-w-2xl mx-auto border border-orange-200">
                <div className="text-xl font-semibold text-orange-800 mb-4">Project Development Progress</div>
                <div className="w-full bg-orange-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${fundingRequirements.roadmap.progress_percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-orange-700 space-y-2">
                  <div className="font-medium">Current Stage: {fundingRequirements.roadmap.current_stage}</div>
                  <div className="text-orange-600">{fundingRequirements.roadmap.stage_description}</div>
                  <div className="text-orange-800 font-semibold mt-3">Next Step: {fundingRequirements.roadmap.next_step}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Funding Requests List */}
      <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-8">
        <h3 className="text-2xl font-bold text-green-800 mb-6">Active Funding Requests</h3>
        <div className="space-y-4">
          {fundings && fundings.length > 0 ? (
            fundings.map((funding) => (
              <div key={funding.funding_id} className="flex items-center justify-between p-6 border border-green-200 rounded-lg hover:bg-green-50 transition-all duration-200">
                <div>
                  <div className="font-semibold text-gray-800 text-lg">طلب التمويل #{funding.funding_id}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    المبلغ المطلوب: {funding.requested_amount?.toLocaleString()} SYP
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    الحالة: <span className={`font-medium ${
                      funding.status === 'approved' ? 'text-green-600' :
                      funding.status === 'rejected' ? 'text-red-600' :
                      funding.status === 'cancelled' ? 'text-gray-600' :
                      'text-orange-600'
                    }`}>
                      {funding.status === 'approved' ? 'موافق عليه' :
                       funding.status === 'rejected' ? 'مرفوض' :
                       funding.status === 'cancelled' ? 'ملغى' :
                       funding.status === 'under_review' ? 'قيد المراجعة' :
                       funding.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {funding.status === 'requested' || funding.status === 'under_review' ? (
                    <button
                      onClick={() => openCancelModal(funding.funding_id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      إلغاء الطلب
                    </button>
                  ) : null}
                  <div className="text-right">
                    {funding.approved_amount ? (
                      <>
                        <div className="font-semibold text-lg text-green-700">
                          {funding.approved_amount.toLocaleString()} SYP
                        </div>
                        <div className="text-sm text-gray-600">المبلغ المعتمد</div>
                      </>
                    ) : (
                      <>
                        <div className="font-semibold text-lg text-orange-700">
                          {funding.requested_amount?.toLocaleString()} SYP
                        </div>
                        <div className="text-sm text-gray-600">المبلغ المطلوب</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-600">
              لا توجد طلبات تمويل حالياً
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Checks Tab Content
  const renderChecks = () => {
    // عرض التمويلات المعتمدة فقط
    const approvedFundings = fundings?.filter(f => f.status === 'approved') || [];
    
    return (
      <div className="space-y-8">
        {approvedFundings.length > 0 ? (
          approvedFundings.map((funding) => (
            <div key={funding.funding_id} className="bg-white rounded-2xl shadow-2xl border border-gray-300 overflow-hidden">
              <div className="bg-gradient-to-r from-black to-gray-900 text-white p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold tracking-tight">INVESTMENT FUND</div>
                    <div className="text-sm text-orange-300 mt-1">Official Funding Check</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">CHECK NO: {funding.funding_id}</div>
                    <div className="text-sm text-orange-300">Date: {funding.transfer_date || 'قيد الانتظار'}</div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Animated Checkmark Section */}
                <div className="flex flex-col items-center justify-center mb-8 py-8 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200">
                  <div className="w-32 h-32 mb-4">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="relative">
                        <svg 
                          className="w-24 h-24 text-green-500 animate-bounce" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={3} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                        <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-75"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-700 mb-2">Payment Verified</div>
                    <div className="text-lg text-green-600">Funds Successfully Processed</div>
                  </div>
                </div>

                <div className="border-b-2 border-dashed border-orange-300 pb-8 mb-8">
                  <div className="text-sm text-gray-600 mb-3">PAY TO THE ORDER OF</div>
                  <div className="text-3xl font-bold text-gray-800 tracking-tight">
                    {funding.investor?.name || 'المستثمر'}
                  </div>
                  <div className="text-gray-600 text-lg mt-2">
                    {funding.investor?.email || 'البريد الإلكتروني'}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">AMOUNT</div>
                    <div className="text-4xl font-bold text-green-600 tracking-tight">
                      {funding.approved_amount?.toLocaleString()} <span className="text-2xl">SYP</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">STATUS</div>
                    <div className="px-6 py-3 rounded-lg text-lg font-bold bg-green-100 text-green-800 border border-green-300">
                      {funding.status === 'approved' ? 'موافق عليه' : funding.status}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base">
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-600 mb-1">Requested Amount</div>
                      <div className="font-semibold text-lg text-gray-800">
                        {funding.requested_amount?.toLocaleString()} SYP
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Payment Method</div>
                      <div className="font-semibold text-lg text-gray-800">
                        {funding.payment_method || 'سيتم تحديده'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-600 mb-1">Committee</div>
                      <div className="font-semibold text-lg text-gray-800">
                        {funding.committee?.name || 'اللجنة'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Reference Number</div>
                      <div className="font-semibold text-lg text-gray-800 font-mono">
                        {funding.transaction_reference || 'REF-PENDING'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black text-white p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-xl font-bold">INVESTMENT FUND BANK</div>
                    <div className="text-orange-300 text-sm">Official Funding Institution</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-orange-300">Evaluation Score</div>
                    <div className="text-3xl font-bold text-green-400">
                      {funding.idea?.initial_evaluation_score || 0}%
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <div className="text-orange-300">Meeting Date</div>
                      <div className="font-semibold text-white text-base">
                        {funding.meeting?.meeting_date || 'لم يتم تحديده'}
                      </div>
                    </div>
                    <div>
                      <div className="text-orange-300">Committee Notes</div>
                      <div className="font-semibold text-white text-base">
                        {funding.committee_notes || 'لا توجد ملاحظات'}
                      </div>
                    </div>
                    <div>
                      <div className="text-orange-300">Transfer Date</div>
                      <div className="font-semibold text-green-400 text-base">
                        {funding.transfer_date || 'قيد الانتظار'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg mb-4">لا توجد تمويلات معتمدة حتى الآن</div>
            <p className="text-gray-500">
              سيظهر هنا التمويلات التي تمت الموافقة عليها
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة التمويل</h1>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                الفكرة: <span className="font-semibold text-green-700">{idea_title}</span>
              </p>
              <button
                onClick={() => navigate(`/ideas/${ideaId}`)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                العودة للفكرة
              </button>
            </div>
          </div>
          
          {/* Tabs Navigation */}
          <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("fundingRequests")}
                className={`flex-1 py-6 px-8 text-xl font-semibold transition-all duration-200 ${
                  activeTab === "fundingRequests"
                    ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                طلبات التمويل
              </button>
              <button
                onClick={() => setActiveTab("checks")}
                className={`flex-1 py-6 px-8 text-xl font-semibold transition-all duration-200 ${
                  activeTab === "checks"
                    ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                التمويلات المعتمدة
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === "fundingRequests" ? renderFundingRequests() : renderChecks()}
          </div>
        </div>
      </div>

      {/* Cancel Funding Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">إلغاء طلب التمويل</h3>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من إلغاء طلب التمويل؟ يمكنك كتابة سبب الإلغاء (اختياري).
            </p>
            <textarea
              value={cancellationData.cancellation_reason}
              onChange={handleCancelReasonChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6"
              placeholder="سبب الإلغاء (اختياري)..."
              maxLength="500"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedFundingId(null);
                  setCancellationData({ cancellation_reason: "" });
                }}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleCancelFunding}
                disabled={isCancelling}
                className={`px-6 py-2 ${
                  isCancelling ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                } text-white rounded-lg`}
              >
                {isCancelling ? 'جاري الإلغاء...' : 'تأكيد الإلغاء'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FundingRequestsCard;