// src/pages/dashboardcommit/CommitteeDashboard/components/DashboardTabs/FundingRequestsTab.jsx
import React, { useState } from "react";
import axios from "axios";
import { CheckCircle, Clock, XCircle, DollarSign, FileText, Eye, X } from "lucide-react";

const FundingRequestsTab = ({ fundingRequests = [], getStatusBadge, refreshData, isLoading }) => {
  const [selectedFunding, setSelectedFunding] = useState(null);
  const [isApproved, setIsApproved] = useState(true);
  const [approvedAmount, setApprovedAmount] = useState("");
  const [committeeNotes, setCommitteeNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Get status badge with support for Funding type or Task/Phase
  const localGetStatusBadge = getStatusBadge || ((status, type) => {
    const base = "px-3 py-1 rounded-full text-sm font-medium ";
    
    const mappingNormal = {
      pending: "bg-orange-50 text-orange-600",
      approved: "bg-emerald-50 text-emerald-600",
      rejected: "bg-red-50 text-red-600",
    };

    const mappingTask = {
      pending: "bg-blue-50 text-blue-600",
      approved: "bg-indigo-50 text-indigo-600",
      rejected: "bg-rose-50 text-rose-600",
    };

    if (type === "task" || type === "phase") {
      return base + (mappingTask[status] || "bg-gray-50 text-gray-600");
    }

    return base + (mappingNormal[status] || "bg-gray-50 text-gray-600");
  });

  const handleEvaluateClick = (funding) => {
    setSelectedFunding(funding);
    setApprovedAmount(funding.requested_amount || "");
    setIsApproved(true);
    setCommitteeNotes("");
  };

  const submitEvaluation = async () => {
    if (!selectedFunding) return;
    const token = localStorage.getItem("committee_token");
    setLoading(true);

    const url =
      selectedFunding.type === "funding"
        ? `http://127.0.0.1:8000/api/fundings/${selectedFunding.funding_id}/evaluate`
        : `http://127.0.0.1:8000/api/funding/${selectedFunding.funding_id}/evaluate/gantt/task`;

    try {
      await axios.post(
        url,
        {
          is_approved: isApproved,
          approved_amount: approvedAmount,
          committee_notes: committeeNotes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Evaluation submitted successfully!");
      setSelectedFunding(null);
      if (typeof refreshData === "function") refreshData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Failed to submit evaluation");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-600"></div>
        <p className="text-gray-500 font-medium">Loading Funding Requests...</p>
      </div>
    );
  }

  if (!fundingRequests || fundingRequests.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-gray-200 py-24 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-base font-medium text-gray-400">No Funding Requests</h3>
        <p className="text-gray-400 text-sm mt-2">No funding requests available for evaluation</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Funding Requests Evaluation</h2>
          <p className="text-gray-500 text-sm mt-1">
            {fundingRequests.length} funding requests awaiting assessment
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Request Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fundingRequests.map((request) => (
              <tr key={request.funding_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600 font-medium">{request.funding_id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{request.idea?.title || "N/A"}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {request.idea?.owner?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">{request.idea?.owner?.name || "Unknown"}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {request.requested_amount ? `$${request.requested_amount}` : "-"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 font-medium">
                    {request.type || "funding"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={localGetStatusBadge(request.status, request.type)}>
                    {request.status?.replace('_', ' ') || 'pending'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(request.created_at).toLocaleDateString('en-US')}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleEvaluateClick(request)}
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Evaluate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Evaluation Modal */}
      {selectedFunding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
  Funding Evaluation
  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
    {selectedFunding.type}
  </span>
</h3>

                <p className="text-sm text-gray-500 mt-1">{selectedFunding.idea?.title}</p>
              </div>
              <button 
                onClick={() => setSelectedFunding(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Request ID</p>
                    <p className="text-sm font-medium text-gray-900">{selectedFunding.funding_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Request Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{selectedFunding.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Owner</p>
                    <p className="text-sm font-medium text-gray-900">{selectedFunding.idea?.owner?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Status</p>
                    <span className={localGetStatusBadge(selectedFunding.status, selectedFunding.type)}>
                      {selectedFunding.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedFunding.type === "funding" && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-600">Requested Amount</p>
                      <p className="text-lg font-bold text-blue-900">${selectedFunding.requested_amount}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evaluation Decision
                  </label>
                  <select
                    value={isApproved}
                    onChange={(e) => setIsApproved(e.target.value === "true")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option value="true">Approved</option>
                    <option value="false">Rejected</option>
                  </select>
                </div>

                {selectedFunding.type === "funding" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Approved Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={approvedAmount}
                        onChange={(e) => setApprovedAmount(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="Enter approved amount"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Committee Notes
                  </label>
                  <textarea
                    value={committeeNotes}
                    onChange={(e) => setCommitteeNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none min-h-[100px]"
                    placeholder="Enter evaluation notes and feedback..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedFunding(null)}
                className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={submitEvaluation}
                disabled={loading}
                className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-all ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {loading ? "Processing..." : "Submit Evaluation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundingRequestsTab;