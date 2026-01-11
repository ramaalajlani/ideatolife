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
      
      setSuccessMessage("Launch request evaluated successfully!");
      
      fetchLaunchRequests();
      
      if (refreshData) refreshData();
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred during evaluation");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      "needs_revision": "bg-blue-100 text-blue-800",
    };
    return config[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Launch Requests Evaluation</h2>
            <p className="text-gray-500 text-sm mt-1">
              {launchRequests.length} pending launch requests requiring evaluation
            </p>
          </div>
          <button
            onClick={fetchLaunchRequests}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Refresh List
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {!selectedRequest ? (
        <div>
          {isLoading || loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-600"></div>
            </div>
          ) : launchRequests.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
        
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Pending Launch Requests</h3>
              <p className="text-gray-600">All launch requests have been processed.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Project Title</th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner</th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Request Date</th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {launchRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">#{req.id}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{req.idea?.title || "N/A"}</div>
                          <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                            {req.idea?.description || "No description"}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {req.idea?.owner?.name?.charAt(0) || "U"}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{req.idea?.owner?.name || "Unknown"}</div>
                              <div className="text-xs text-gray-500">{req.idea?.owner?.email || "No email"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(req.status)}`}>
                            {req.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600">{formatDate(req.created_at)}</div>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleSelectRequest(req)}
                            className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                          >
                            Evaluate Request
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Evaluate Launch Request</h3>
                <p className="text-gray-500 text-sm mt-1">Project: {selectedRequest.idea?.title}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Back to List
              </button>
            </div>
          </div>

          {/* Evaluation Form */}
          <form onSubmit={handleEvaluate} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Decision Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Decision
                  <span className="text-xs text-gray-500 ml-2">- Select approval status for the launch request</span>
                </label>
                <select
                  name="decision"
                  value={form.decision}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="needs_revision">Needs Revision</option>
                </select>
              </div>

              {/* Launch Date Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Launch Date
                  <span className="text-xs text-gray-500 ml-2">- Proposed date for project launch</span>
                </label>
                <input
                  type="date"
                  name="launch_date"
                  value={form.launch_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Strengths Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strengths
                <span className="text-xs text-gray-500 ml-2">- Identify the project's competitive advantages and strong points</span>
              </label>
              <textarea
                name="strengths"
                value={form.strengths}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none min-h-[100px]"
                placeholder="List the key strengths of this project..."
              />
            </div>

            {/* Weaknesses Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weaknesses
                <span className="text-xs text-gray-500 ml-2">- Point out areas that need improvement or pose risks</span>
              </label>
              <textarea
                name="weaknesses"
                value={form.weaknesses}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none min-h-[100px]"
                placeholder="Identify potential weaknesses and concerns..."
              />
            </div>

            {/* Recommendations Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recommendations
                <span className="text-xs text-gray-500 ml-2">- Required: Suggest specific steps for successful launch</span>
              </label>
              <textarea
                name="recommendations"
                value={form.recommendations}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none min-h-[100px]"
                placeholder="Provide actionable recommendations for launch preparation..."
              />
            </div>

            {/* Committee Notes Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Committee Notes
                <span className="text-xs text-gray-500 ml-2">- Additional comments or feedback for the project team</span>
              </label>
              <textarea
                name="committee_notes"
                value={form.committee_notes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none min-h-[100px]"
                placeholder="Add any additional comments or observations..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Submit Evaluation"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LaunchRequestsTab;