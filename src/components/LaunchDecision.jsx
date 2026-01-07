
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import launchService from "../services/launchService";

const LaunchDecision = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();

  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDecision = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await launchService.getLaunchDecision(ideaId);
        setDecision(data);
      } catch (err) {
        setError(err.message || "فشل في جلب قرار الإطلاق");
      } finally {
        setLoading(false);
      }
    };

    fetchDecision();
  }, [ideaId]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start py-16 px-4">
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-6 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-4">Launch Decision</h1>

        {loading && <p>Loading decision...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !decision && !error && <p>No decision found.</p>}

        {decision && (
          <div className="space-y-4">
            <p>
              <span className="font-semibold">Status:</span> {decision.status}
            </p>
            {decision.comments && (
              <p>
                <span className="font-semibold">Comments:</span> {decision.comments}
              </p>
            )}
            {decision.reviewer && (
              <p>
                <span className="font-semibold">Reviewed by:</span> {decision.reviewer.name}
              </p>
            )}
            {decision.reviewed_at && (
              <p>
                <span className="font-semibold">Reviewed at:</span>{" "}
                {new Date(decision.reviewed_at).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LaunchDecision;
