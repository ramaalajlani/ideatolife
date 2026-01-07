import React, { useState, useEffect } from "react";
import axios from "axios";

const LaunchRequestsTab = ({ isLoading, refreshData }) => {
  const [launchRequests, setLaunchRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [form, setForm] = useState({
    decision: "approved",
    strengths: "",
    weaknesses: "",
    recommendations: "",
    committee_notes: "",
    launch_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const token = localStorage.getItem("committee_token");

  const fetchLaunchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/launch-requests/pending",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLaunchRequests(res.data.pending_launch_requests || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch launch requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaunchRequests();
  }, []);

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
    setSuccessMessage(null);
    setForm({
      decision: "approved",
      strengths: "",
      weaknesses: "",
      recommendations: "",
      committee_notes: "",
      launch_date: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/committee/launch-requests/${selectedRequest.id}/evaluate`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccessMessage("Request evaluated successfully!");
      
      fetchLaunchRequests();
      
      if (refreshData) refreshData();
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred during evaluation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Pending Launch Requests</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {successMessage && <p className="text-green-600 mb-3">{successMessage}</p>}

      {!selectedRequest ? (
        <div>
          {isLoading ? (
            <p>Loading...</p>
          ) : launchRequests.length === 0 ? (
            <p>No launch requests currently.</p>
          ) : (
            <ul>
              {launchRequests.map((req) => (
                <li
                  key={req.id}
                  className="p-4 mb-2 border rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelectRequest(req)}
                >
                  <strong>{req.idea.title}</strong> - Status: {req.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <form
          className="bg-gray-50 p-4 rounded border"
          onSubmit={handleEvaluate}
        >
          <h3 className="font-semibold mb-2">{selectedRequest.idea.title}</h3>

          <label className="block mb-2">
            Decision:
            <select
              name="decision"
              value={form.decision}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="needs_revision">Needs Revision</option>
            </select>
          </label>

          <label className="block mb-2">
            Strengths:
            <textarea
              name="strengths"
              value={form.strengths}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>

          <label className="block mb-2">
            Weaknesses:
            <textarea
              name="weaknesses"
              value={form.weaknesses}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>

          <label className="block mb-2">
            Recommendations:
            <textarea
              name="recommendations"
              value={form.recommendations}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </label>

          <label className="block mb-2">
            Committee Notes:
            <textarea
              name="committee_notes"
              value={form.committee_notes}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>

          <label className="block mb-2">
            Expected Launch Date:
            <input
              type="date"
              name="launch_date"
              value={form.launch_date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Sending..." : "Evaluate Request"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRequest(null);
                setSuccessMessage(null);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Close
            </button>
            
            {successMessage && (
              <button
                type="button"
                onClick={() => {
                  setSelectedRequest(null);
                  setSuccessMessage(null);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Select Another Request
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default LaunchRequestsTab;