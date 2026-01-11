// src/components/LaunchIdea.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import launchService from "../services/launchService";
import lottie from "lottie-web";
import lampAnimation from "../assets/animations/lamp idea.json";

const LaunchIdea = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const headerAnimationContainer = useRef(null);
  const headerAnimationInstance = useRef(null);

  const [form, setForm] = useState({
    execution_steps: "",
    marketing_strategy: "",
    risk_mitigation: "",
    founder_commitment: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [myLaunchRequests, setMyLaunchRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestError, setRequestError] = useState(null);

  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [currentDecision, setCurrentDecision] = useState(null);

  useEffect(() => {
    if (headerAnimationContainer.current) {
      headerAnimationInstance.current = lottie.loadAnimation({
        container: headerAnimationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: lampAnimation,
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
    }
    return () => {
      headerAnimationInstance.current?.destroy();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await launchService.requestLaunch(ideaId, form);
      setSuccess(res.message || "Launch request submitted successfully!");
      fetchMyLaunchRequests();
      setTimeout(() => navigate(`/ideas/${ideaId}/roadmap`), 2000);
    } catch (err) {
      setError(err.message || "Failed to submit launch request");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyLaunchRequests = async () => {
    setLoadingRequests(true);
    setRequestError(null);
    try {
      const data = await launchService.getMyLaunchRequests();
      setMyLaunchRequests(data.launch_requests || []);
    } catch (err) {
      setRequestError(err.message || "Failed to fetch launch requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchMyLaunchRequests();
  }, []);

  const handleRequestFunding = async (idea_id) => {
    const amount = prompt("Enter requested funding amount (e.g., 50000 USD):");
    const justification = prompt("Enter justification for funding (Explain why you need this amount and how it will be used):");
    if (!amount || !justification) return;
    try {
      const data = { requested_amount: amount, justification };
      const res = await launchService.requestFunding(idea_id, data);
      alert(res.message || "Funding request submitted successfully!");
    } catch (err) {
      alert(err.message || "Failed to submit funding request");
    }
  };

  const openDecisionModal = async (idea_id) => {
    try {
      const res = await launchService.getLaunchDecision(idea_id);
      if (res.launch_requests && res.launch_requests.length > 0) {
        setCurrentDecision(res.launch_requests[0]);
        setDecisionModalOpen(true);
      } else {
        alert("No launch requests found for this idea.");
      }
    } catch (err) {
      alert(err.message || "Failed to fetch launch decision");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="bg-[#FFD586] shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full lg:w-2/5 flex justify-center">
            <div
              ref={headerAnimationContainer}
              className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px]"
            />
          </div>
          <div className="w-full lg:w-3/5 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              PROJECT LAUNCH REQUEST
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Complete this form to officially launch your project. Fill all fields carefully.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">My Previous Launch Requests</h2>
          <p className="text-gray-600 mb-6">
            Here you can see all your previous launch requests and their status. 
            Click "View Decision" to see committee feedback. If your request is approved, 
            you can click "Request Funding" to apply for project funding.
          </p>

          {loadingRequests && (
            <div className="text-center py-6">
              <p className="text-gray-500">Loading your launch requests...</p>
            </div>
          )}
          
          {requestError && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
              <p className="text-red-700">{requestError}</p>
            </div>
          )}
          
          {!loadingRequests && myLaunchRequests.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No launch requests found. Submit your first request using the form below.</p>
            </div>
          )}

          {myLaunchRequests.length > 0 && (
            <ul className="space-y-4">
              {myLaunchRequests.map((req) => (
                <li key={req.id} className="border border-gray-200 p-6 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-800">{req.idea.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          req.status === 'approved' ? 'bg-green-100 text-green-800' :
                          req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {req.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">
                        <strong>Submitted:</strong> {new Date(req.created_at).toLocaleDateString()} at {new Date(req.created_at).toLocaleTimeString()}
                      </p>
                      {req.updated_at && (
                        <p className="text-gray-600">
                          <strong>Last Updated:</strong> {new Date(req.updated_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => openDecisionModal(req.idea.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        View Decision
                      </button>
                      {req.status === "approved" && (
                        <button
                          onClick={() => handleRequestFunding(req.idea.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                          Request Funding
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                    {req.status === "approved" ? (
                      <p><strong>Action Available:</strong> You can now request funding for this project. Click "Request Funding" button.</p>
                    ) : req.status === "pending" ? (
                      <p><strong>Status:</strong> Your request is under committee review. Check back later or view decision for updates.</p>
                    ) : req.status === "rejected" ? (
                      <p><strong>Note:</strong> View committee decision to understand the reasons and get feedback for improvement.</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              New Launch Request Form
            </h2>
            <p className="text-gray-600">
              Fill out all sections below to submit a new launch request. All fields are required.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 mb-6 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 p-4 mb-6 rounded-lg">
              <p className="text-green-700">{success}</p>
              <p className="text-green-600 mt-2">You will be redirected to the roadmap page in 2 seconds...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                1. Execution Steps
              </label>
              <p className="text-gray-600 mb-3">
                Describe the practical steps to implement your idea. Be specific about timelines, resources needed, and key milestones.
                Example: "1. Develop prototype (Month 1-2), 2. Market testing (Month 3), 3. Initial launch (Month 4)"
              </p>
              <textarea
                name="execution_steps"
                placeholder="Enter detailed execution plan..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                required
                value={form.execution_steps}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                2. Marketing Strategy
              </label>
              <p className="text-gray-600 mb-3">
                Explain how you will promote your project and attract customers/users.
                Include channels, target audience, and marketing budget if applicable.
              </p>
              <textarea
                name="marketing_strategy"
                placeholder="Describe your marketing approach..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                required
                value={form.marketing_strategy}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                3. Risk Mitigation Plan
              </label>
              <p className="text-gray-600 mb-3">
                Identify potential risks and how you plan to manage them.
                Consider financial, technical, market, and operational risks.
              </p>
              <textarea
                name="risk_mitigation"
                placeholder="Describe your risk management strategy..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none"
                required
                value={form.risk_mitigation}
                onChange={handleChange}
              />
            </div>

            <div>
              <div className="p-5 border border-gray-300 rounded-lg hover:border-green-500 transition-colors bg-gray-50">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    name="founder_commitment"
                    checked={form.founder_commitment}
                    onChange={handleChange}
                    className="w-5 h-5 text-green-600 rounded mt-1"
                    required
                  />
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">
                      4. Founder Commitment Declaration
                    </label>
                    <p className="text-gray-600">
                      By checking this box, I confirm my full dedication and commitment to implement this project.
                      I understand that launching a project requires significant time, effort, and responsibility.
                      I commit to actively work on this project and allocate the necessary resources for its success.
                    </p>
                    <p className="text-gray-500 mt-2 text-sm">
                      Note: This commitment is required for all launch requests.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-gray-600 mb-6">
                <strong>Important:</strong> After submission, your request will be reviewed by the committee.
                You can check the status in "My Previous Launch Requests" section above.
                Approval typically takes 3-5 business days.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-orange-800 py-4 px-6 w-full rounded-md text-white text-lg font-semibold transition-all duration-300 hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Submitting Launch Request..." : "Submit Launch Request"}
              </button>
              <p className="text-gray-500 text-center mt-3 text-sm">
                You will be redirected to the project roadmap page upon successful submission.
              </p>
            </div>
          </form>
        </div>
      </div>

      {decisionModalOpen && currentDecision && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-r from-[#FFF1CC] to-[#FFD586] p-8 rounded-xl shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Launch Committee Decision</h3>
              <button
                onClick={() => setDecisionModalOpen(false)}
                className="text-gray-700 text-xl font-bold hover:text-gray-900"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-5">
        
              
              <div>
                <strong className="text-gray-800">Status:</strong>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                  currentDecision.status === 'approved' ? 'bg-green-100 text-green-800' :
                  currentDecision.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {currentDecision.status.toUpperCase()}
                </span>
              </div>
              
              <div>
                <strong className="text-gray-800">Committee Decision:</strong>
                <p className="text-gray-700 mt-1 bg-white/50 p-3 rounded">{currentDecision.decision_text || "No decision text provided."}</p>
              </div>
              
              {currentDecision.committee_notes && (
                <div>
                  <strong className="text-gray-800">Committee Notes:</strong>
                  <p className="text-gray-700 mt-1 bg-white/50 p-3 rounded">{currentDecision.committee_notes}</p>
                </div>
              )}
              
              {currentDecision.approved_at && (
                <div>
                  <strong className="text-gray-800">Approval Date:</strong>
                  <p className="text-gray-700">{new Date(currentDecision.approved_at).toLocaleDateString()}</p>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-300">
                <p className="text-gray-700">
                  <strong>Next Steps:</strong> {
                    currentDecision.status === 'approved' 
                      ? "You can now request funding for this project." 
                      : currentDecision.status === 'rejected'
                      ? "You may revise and resubmit your launch request after addressing the committee's feedback."
                      : "Your request is still under review. Check back later for updates."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaunchIdea;