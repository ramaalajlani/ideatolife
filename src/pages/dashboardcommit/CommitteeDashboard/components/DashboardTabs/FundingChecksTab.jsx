import React, { useState, useEffect } from "react";
import axios from "axios";
import { CreditCard, User, FileText, DollarSign, Calendar, ArrowRight } from "lucide-react";

const FundingChecksTab = () => {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchChecks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("committee_token");
      if (!token) {
        setMessage("Access denied. Please log in.");
        return;
      }

      const res = await axios.get("http://127.0.0.1:8000/api/committee/funding-checks", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.checks?.length > 0) {
        setChecks(res.data.checks);
        setMessage("");
      } else {
        setMessage("No checks available at the moment.");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "An error occurred while fetching checks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-600 font-medium">Loading checks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Funding Transactions</h2>
          <p className="text-gray-500 text-sm mt-1">Track all funding transfers and payments</p>
        </div>
        <button
          onClick={fetchChecks}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {checks.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Idea
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Owner
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Investor
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Amount
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Transfer
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Method
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {checks.map((tx, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{tx.idea_title || "—"}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-700">{tx.idea_owner || "—"}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-700">{tx.investor || "—"}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">${tx.amount}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm bg-gray-100 px-3 py-1 rounded">{tx.from}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="text-sm bg-gray-100 px-3 py-1 rounded">{tx.to}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">{tx.date}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-100">
                        {tx.payment_method || "—"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600 max-w-xs truncate" title={tx.notes}>
                        {tx.notes || "—"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{checks.length}</span> transactions
            </div>
          </div>
        </div>
      ) : !message && (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No Transactions Found</h3>
          <p className="text-gray-400 text-sm mt-2">There are no funding transactions to display</p>
        </div>
      )}
    </div>
  );
};

export default FundingChecksTab;
