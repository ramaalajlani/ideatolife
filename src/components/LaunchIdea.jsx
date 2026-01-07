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

  // Modal Decision
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [currentDecision, setCurrentDecision] = useState(null);

  // Load lamp animation
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
    const amount = prompt("Enter requested funding amount:");
    const justification = prompt("Enter justification for funding:");
    if (!amount || !justification) return;
    try {
      const data = { requested_amount: amount, justification };
      const res = await launchService.requestFunding(idea_id, data);
      alert(res.message || "Funding request submitted successfully!");
    } catch (err) {
      alert(err.message || "Failed to submit funding request");
    }
  };

  // Open decision modal
  const openDecisionModal = async (idea_id) => {
    try {
      const res = await launchService.getLaunchDecision(idea_id);
      if (res.launch_requests && res.launch_requests.length > 0) {
        setCurrentDecision(res.launch_requests[0]); // Take first request
        setDecisionModalOpen(true);
      } else {
        alert("لا توجد طلبات إطلاق لهذه الفكرة.");
      }
    } catch (err) {
      alert(err.message || "Failed to fetch launch decision");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header with Lamp Animation */}
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
              Complete this form to officially launch your project.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        {/* Launch Request Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Launch Request Form
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 mb-6 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 p-4 mb-6 rounded-lg">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <textarea
              name="execution_steps"
              placeholder="Execution steps..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
              required
              value={form.execution_steps}
              onChange={handleChange}
            />
            <textarea
              name="marketing_strategy"
              placeholder="Marketing strategy..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
              required
              value={form.marketing_strategy}
              onChange={handleChange}
            />
            <textarea
              name="risk_mitigation"
              placeholder="Risk mitigation plan..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none"
              required
              value={form.risk_mitigation}
              onChange={handleChange}
            />
            <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg hover:border-green-500 transition-colors">
              <input
                type="checkbox"
                name="founder_commitment"
                checked={form.founder_commitment}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 rounded mt-1"
                required
              />
              <div>I commit to full dedication in project implementation</div>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-orange-800 py-3 px-4 w-full rounded-md text-white transition-all duration-300 hover:scale-105"
            >
              {loading ? "Submitting Launch Request..." : "Submit Launch Request"}
            </button>
          </form>
        </div>

        {/* My Launch Requests */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">My Launch Requests</h2>

          {loadingRequests && <p>Loading launch requests...</p>}
          {requestError && <p className="text-red-600">{requestError}</p>}
          {!loadingRequests && !myLaunchRequests.length && <p>No launch requests found.</p>}

          {myLaunchRequests.length > 0 && (
            <ul className="space-y-4">
              {myLaunchRequests.map((req) => (
                <li key={req.id} className="border p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-semibold">{req.idea.title}</h3>
                    <p>Status: <strong>{req.status}</strong></p>
                    <p>Submitted at: {new Date(req.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => openDecisionModal(req.idea.id)}
                      className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      View Decision
                    </button>
                    {req.status === "approved" && (
                      <button
                        onClick={() => handleRequestFunding(req.idea.id)}
                        className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                      >
                        Request Funding
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Decision Modal */}
      {decisionModalOpen && currentDecision && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-r from-[#FFF1CC] to-[#FFD586] p-6 rounded-xl shadow-lg w-full max-w-md relative text-gray-800">
            <button
              onClick={() => setDecisionModalOpen(false)}
              className="absolute top-3 right-3 text-gray-700 font-bold text-lg"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Launch Decision</h3>
            <p><strong>Status:</strong> {currentDecision.status}</p>
            <p><strong>Decision:</strong> {currentDecision.decision_text}</p>
            {currentDecision.committee_notes && <p><strong>Committee Notes:</strong> {currentDecision.committee_notes}</p>}
            {currentDecision.approved_at && <p><strong>Approved At:</strong> {new Date(currentDecision.approved_at).toLocaleString()}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default LaunchIdea;
