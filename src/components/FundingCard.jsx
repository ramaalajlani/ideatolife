import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import fundingService from "../services/fundingService";
import Lottie from "lottie-react";
import walletAnimation from "../assets/animations/Wallet animation.json";

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
  const [showAmountGuide, setShowAmountGuide] = useState(false);
  const [showJustificationGuide, setShowJustificationGuide] = useState(false);

  // Fetch funding data
  useEffect(() => {
    const loadFundingData = async () => {
      if (!ideaId) {
        setError('No idea selected');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch funding data
        const response = await fundingService.getFundingForIdea(ideaId);
        setFundingData(response);
        
        // Fetch eligibility data
        const eligibility = await fundingService.checkFundingEligibility(ideaId);
        setFundingRequirements(eligibility);
        
      } catch (error) {
        console.error('Error loading funding data:', error);
        setError(error.message || 'Error loading funding data');
      } finally {
        setLoading(false);
      }
    };

    loadFundingData();
  }, [ideaId]);

  const handleSubmitFunding = async (e) => {
    e.preventDefault();
    
    if (!ideaId) {
      alert('❌ Please select an idea first');
      return;
    }

    if (!formData.requested_amount || parseFloat(formData.requested_amount) <= 0) {
      alert('❌ Please enter a valid amount');
      return;
    }

    if (!formData.justification.trim()) {
      alert('❌ Please write funding justification');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fundingService.requestFunding(ideaId, {
        requested_amount: parseFloat(formData.requested_amount),
        justification: formData.justification
      });
      
      alert(`✅ ${response.message || 'Funding request submitted successfully!'}`);
      
      // Refresh data
      const updatedData = await fundingService.getFundingForIdea(ideaId);
      setFundingData(updatedData);
      
      // Reset form
      setFormData({ requested_amount: "", justification: "" });
      setShowFundingForm(false);
      
    } catch (error) {
      console.error('Error submitting funding request:', error);
      
      if (error.message?.includes('eligibility')) {
        alert(`❌ ${error.message}`);
      } else if (error.message?.includes('business plan')) {
        alert(`❌ ${error.message}`);
      } else if (error.message?.includes('evaluation')) {
        alert(`❌ ${error.message}`);
      } else if (error.message?.includes('new funding request')) {
        alert(`❌ ${error.message}`);
      } else if (error.message) {
        alert(`❌ ${error.message}`);
      } else {
        alert('❌ Error submitting funding request');
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
      
      alert(`✅ ${response.message || 'Funding request cancelled successfully!'}`);
      
      // Refresh data
      const updatedData = await fundingService.getFundingForIdea(ideaId);
      setFundingData(updatedData);
      
      // Reset
      setShowCancelModal(false);
      setSelectedFundingId(null);
      setCancellationData({ cancellation_reason: "" });
      
    } catch (error) {
      console.error('Error cancelling funding:', error);
      
      if (error.message?.includes('eligibility')) {
        alert(`❌ ${error.message}`);
      } else if (error.message?.includes('cannot cancel')) {
        alert(`❌ ${error.message}`);
      } else if (error.message) {
        alert(`❌ ${error.message}`);
      } else {
        alert('❌ Error cancelling funding request');
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading funding data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/ideas')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Back to Ideas List
          </button>
        </div>
      </div>
    );
  }

  // No funding data
  if (!fundingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-3">No Funding Data</h2>
          <p className="text-gray-600 mb-6">
            No funding requests for this idea yet.
          </p>
          <button
            onClick={() => navigate(`/ideas/${ideaId}`)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            View Idea
          </button>
        </div>
      </div>
    );
  }

  const { fundings, idea_title } = fundingData;

  // User Guide Components
  const AmountInputGuide = () => (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-4">
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-blue-800 mb-2">💰 Amount Input Guide</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Enter the amount in Syrian Pounds only (no need to write SYP)</li>
            <li>• Use numbers only without commas or dots</li>
            <li>• You can request any amount - there are no limits</li>
            <li>• Make sure the amount is realistic and justifiable</li>
            <li className="font-semibold">Example: 100000 (one hundred thousand pounds)</li>
          </ul>
          <button 
            onClick={() => setShowAmountGuide(false)}
            className="mt-3 text-blue-600 text-sm hover:text-blue-800"
          >
            Got it, Hide Guide
          </button>
        </div>
      </div>
    </div>
  );

  const JustificationGuide = () => (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-4">
      <div className="flex items-start gap-3">
        <div className="bg-purple-100 p-2 rounded-lg">
       
        </div>
        <div>
          <h4 className="font-bold text-purple-800 mb-2">Justification Writing Guide</h4>
          <ul className="text-purple-700 text-sm space-y-1">
            <li>• Explain in detail how the funds will be used</li>
            <li>• Specify the spending timeline</li>
            <li>• Mention the expected benefits for the project</li>
            <li>• Avoid general information and focus on your specific needs</li>
            <li>• Maximum: 1000 characters</li>
          </ul>
          <div className="mt-3 bg-white p-3 rounded-lg border border-purple-100">
            <p className="text-purple-600 text-xs font-semibold">Good Example:</p>
            <p className="text-purple-700 text-xs">"I need 100,000 pounds to purchase basic manufacturing equipment and cover labor salaries for 3 months, which will enable us to start production and increase revenues by 40%"</p>
          </div>
          <button 
            onClick={() => setShowJustificationGuide(false)}
            className="mt-3 text-purple-600 text-sm hover:text-purple-800"
          >
            Got it, Hide Guide
          </button>
        </div>
      </div>
    </div>
  );

  const RequirementsExplanation = () => (
    <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-100 p-2 rounded-lg">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 className="font-bold text-green-800"> Eligibility Requirements Explanation</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="font-semibold text-green-700">Business Plan Completed</span>
          </div>
          <p className="text-gray-600 text-xs">Must complete the full business plan before applying for funding</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="font-semibold text-green-700">Minimum Score Achieved</span>
          </div>
          <p className="text-gray-600 text-xs">Must achieve the minimum score in the evaluation</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="font-semibold text-green-700">No Pending Requests</span>
          </div>
          <p className="text-gray-600 text-xs">Cannot submit a new request while there is a request under review</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="font-semibold text-green-700">Committee Assigned</span>
          </div>
          <p className="text-gray-600 text-xs">A committee must be assigned to evaluate the funding request</p>
        </div>
      </div>
    </div>
  );

  const StatusGuide = () => (
    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Request Status Guide
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="font-semibold text-green-700">Approved </div>
          <p className="text-green-600 text-xs">Request has been approved and is ready for disbursement</p>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
          <div className="font-semibold text-orange-700">Under Review </div>
          <p className="text-orange-600 text-xs">Request is being studied by the committee</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="font-semibold text-red-700">Rejected </div>
          <p className="text-red-600 text-xs">Request has been rejected based on evaluation</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="font-semibold text-gray-700">Cancelled </div>
          <p className="text-gray-600 text-xs">Request was cancelled by the user</p>
        </div>
      </div>
    </div>
  );

  // Header Component with animation
  const renderHeader = () => (
    <div className="mb-8">
      <div className="bg-[#FFD586] rounded-2xl shadow-2xl p-8 mb-6 overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Smart Funding Gateway
            </h1>
            <p className="text-xl text-gray-800 mb-6">
              Get the funding you need for your project <span className="font-bold text-green-700">"{idea_title}"</span>
            </p>
            
            {/* Quick Guide Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 border border-orange-200 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quick User Guide
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <div className="bg-green-100 p-1 rounded mt-0.5">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Check Requirements</span>
                    <p className="text-gray-600 text-xs">Ensure all green conditions are completed</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 p-1 rounded mt-0.5">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Fill the Form</span>
                    <p className="text-gray-600 text-xs">Enter amount and justifications accurately</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-purple-100 p-1 rounded mt-0.5">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Track Request</span>
                    <p className="text-gray-600 text-xs">Review your request status in active requests list</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <span className="text-green-700 font-bold text-lg"> Unlimited Amount</span>
                <span className="text-gray-700 text-sm ml-2"> - Request any amount you need</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <span className="text-orange-700 font-bold text-lg"> Fast Processing</span>
                <span className="text-gray-700 text-sm ml-2"> - No restrictions or limits</span>
              </div>
            </div>
            <button
              onClick={() => setShowFundingForm(!showFundingForm)}
              disabled={fundings?.some(f => f.status === 'requested' || f.status === 'under_review')}
              className={`px-8 py-4 text-lg ${
                fundings?.some(f => f.status === 'requested' || f.status === 'under_review')
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800 shadow-xl'
              } text-white rounded-xl font-bold transition-all duration-300 hover:scale-105`}
            >
              {showFundingForm ? "Cancel Request" : "Start Funding Request Now"}
            </button>
          </div>
          <div className="md:w-1/3 mt-6 md:mt-0">
            <Lottie
              animationData={walletAnimation}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: 200 }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Funding Requests Tab Content
  const renderFundingRequests = () => (
    <div className="space-y-8">
      {/* Active Funding Requests List - NOW SHOWN FIRST */}
      <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-green-800">Active Funding Requests</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Approved</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span>Under Review</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Rejected</span>
            </div>
          </div>
        </div>
        
        {/* Status Guide */}
        {StatusGuide()}
        
        <div className="space-y-4">
          {fundings && fundings.length > 0 ? (
            fundings.map((funding) => (
              <div key={funding.funding_id} className="flex items-center justify-between p-6 border border-green-200 rounded-lg hover:bg-green-50 transition-all duration-200">
                <div>
                  <div className="font-semibold text-gray-800 text-lg">Funding Request {funding.funding_id}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Requested Amount: {funding.requested_amount?.toLocaleString()} SYP
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Status: <span className={`font-medium ${
                      funding.status === 'approved' ? 'text-green-600' :
                      funding.status === 'rejected' ? 'text-red-600' :
                      funding.status === 'cancelled' ? 'text-gray-600' :
                      'text-orange-600'
                    }`}>
                      {funding.status === 'approved' ? 'Approved' :
                       funding.status === 'rejected' ? 'Rejected' :
                       funding.status === 'cancelled' ? 'Cancelled' :
                       funding.status === 'under_review' ? 'Under Review' :
                       funding.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {funding.status === 'requested' || funding.status === 'under_review' ? (
                    <button
                      onClick={() => openCancelModal(funding.funding_id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel Request
                    </button>
                  ) : null}
                  <div className="text-right">
                    {funding.approved_amount ? (
                      <>
                        <div className="font-semibold text-lg text-green-700">
                          {funding.approved_amount.toLocaleString()} SYP
                        </div>
                        <div className="text-sm text-gray-600">Approved Amount</div>
                      </>
                    ) : (
                      <>
                        <div className="font-semibold text-lg text-orange-700">
                          {funding.requested_amount?.toLocaleString()} SYP
                        </div>
                        <div className="text-sm text-gray-600">Requested Amount</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-600">
              No funding requests currently
            </div>
          )}
        </div>
      </div>

      {/* New Funding Request Section - NOW SHOWN AFTER ACTIVE REQUESTS */}
      <div className="bg-white rounded-2xl shadow-2xl border border-orange-200 overflow-hidden">
        <div className="bg-gradient-to-r from-black to-gray-900 text-white p-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold tracking-tight">NEW FUNDING REQUEST</div>
              <div className="text-sm text-orange-300 mt-1">Submit Your Funding Application</div>
            </div>
            <div className="flex items-center gap-4">
  
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
        </div>

        {showFundingForm ? (
          <div className="p-8">
            <form onSubmit={handleSubmitFunding} className="space-y-8">
              {/* Amount Guide */}
              {showAmountGuide && <AmountInputGuide />}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Requested Amount (SYP)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAmountGuide(!showAmountGuide)}
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {showAmountGuide ? 'Hide Guide' : 'Show Guide'}
                    </button>
                  </div>
                  <input
                    type="number"
                    name="requested_amount"
                    value={formData.requested_amount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Enter amount in SYP"
                    required
                    min="1"
                  />
                  <div className="mt-2">
                    <p className="text-sm text-green-600">No restrictions - Request any amount you need</p>
                    <p className="text-xs text-gray-500">Enter numbers only (e.g., 50000, 100000, 250000)</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Project Idea
                  </label>
                  <div className="px-4 py-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="font-semibold text-gray-800">{idea_title}</div>
                    <div className="text-sm text-gray-600 mt-1">Idea {ideaId}</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">This field is automatically filled with your project information</p>
                </div>
              </div>

              {/* Justification Guide */}
              {showJustificationGuide && <JustificationGuide />}
              
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Justification for Funding
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowJustificationGuide(!showJustificationGuide)}
                    className="text-purple-600 hover:text-purple-800 text-xs flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {showJustificationGuide ? 'Hide Guide' : 'Show Guide'}
                  </button>
                </div>
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
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-orange-600">
                    {formData.justification.length}/1000 characters
                  </div>
                  <p className="text-xs text-gray-500">Be specific about how funds will be allocated and timeline</p>
                </div>
              </div>

              {/* Requirements Check */}
              {fundingRequirements && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-semibold text-green-800">Application Requirements</div>
                    <button
                      onClick={() => setShowAmountGuide(false)}
                      className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Requirements Guide
                    </button>
                  </div>
                  
                  {/* Requirements Explanation */}
                  {RequirementsExplanation()}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className={`w-2 h-2 rounded-full ${fundingRequirements.business_plan_completed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700"> Use actual numbers and percentages</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className={`w-2 h-2 rounded-full ${fundingRequirements.minimum_score_achieved ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700">Explain how each expense will lead to revenue growth</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className={`w-2 h-2 rounded-full ${fundingRequirements.no_pending_requests ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700">Explain your backup plan if you don't get the full amount</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className={`w-2 h-2 rounded-full ${fundingRequirements.committee_assigned ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700">Don't request less than needed or more than reasonable</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className={`w-2 h-2 rounded-full ${fundingRequirements.investor_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700">Check your communications regularly</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-gray-700">Emergency Fund</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      <span className="font-semibold">Note:</span> All requirements must show green dots before you can submit your funding request.
                    </p>
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
                ? 'You have a funding request under review currently.'
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
    </div>
  );

  // Checks Tab Content
  const renderChecks = () => {
    // Show only approved fundings
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
                    <div className="text-sm text-orange-300">Date: {funding.transfer_date || 'Pending'}</div>
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
                    {funding.investor?.name || 'Investor'}
                  </div>
                  <div className="text-gray-600 text-lg mt-2">
                    {funding.investor?.email || 'Email'}
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
                      {funding.status === 'approved' ? 'Approved' : funding.status}
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
                        {funding.payment_method || 'To be determined'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-600 mb-1">Committee</div>
                      <div className="font-semibold text-lg text-gray-800">
                        {funding.committee?.name || 'Committee'}
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
                        {funding.meeting?.meeting_date || 'Not scheduled'}
                      </div>
                    </div>
                    <div>
                      <div className="text-orange-300">Committee Notes</div>
                      <div className="font-semibold text-white text-base">
                        {funding.committee_notes || 'No notes'}
                      </div>
                    </div>
                    <div>
                      <div className="text-orange-300">Transfer Date</div>
                      <div className="font-semibold text-green-400 text-base">
                        {funding.transfer_date || 'Pending'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg mb-4">No approved fundings yet</div>
            <p className="text-gray-500">
              Approved fundings will appear here
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
          
          {/* Header with Animation */}
          {renderHeader()}
          
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
                Funding Requests
              </button>
              <button
                onClick={() => setActiveTab("checks")}
                className={`flex-1 py-6 px-8 text-xl font-semibold transition-all duration-200 ${
                  activeTab === "checks"
                    ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                Approved Fundings
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === "fundingRequests" ? renderFundingRequests() : renderChecks()}
          </div>
        </div>
      </div>

      {/* Cancel Funding Modal with Guide */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Cancel Funding Request</h3>
            
            {/* Cancellation Guide */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">Important:</span> You can only cancel requests that are "Requested" or "Under Review". Once cancelled, you cannot undo this action.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this funding request? You can write a reason (optional).
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Reason (Optional)
              </label>
              <textarea
                value={cancellationData.cancellation_reason}
                onChange={handleCancelReasonChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2"
                placeholder="Explain why you're cancelling this request..."
                maxLength="500"
              />
              <p className="text-xs text-gray-500">
                {cancellationData.cancellation_reason.length}/500 characters - This helps us understand your decision
              </p>
            </div>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedFundingId(null);
                  setCancellationData({ cancellation_reason: "" });
                }}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelFunding}
                disabled={isCancelling}
                className={`px-6 py-2 ${
                  isCancelling ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                } text-white rounded-lg`}
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FundingRequestsCard;