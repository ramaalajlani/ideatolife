import React, { useState, useEffect } from "react";
import axios from "axios";

const FundingChecksTab = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [expandedWalletId, setExpandedWalletId] = useState(null);

  const fetchWallets = async () => {
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

      if (res.data) {
        if (res.data.wallet_id) {
          setWallets([res.data]);
        } 
        else if (res.data.wallets && Array.isArray(res.data.wallets)) {
          setWallets(res.data.wallets);
        } 
        else if (res.data.transactions && Array.isArray(res.data.transactions)) {
          const wallet = {
            wallet_id: 1,
            owner_name: "System",
            balance: res.data.transactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0),
            transactions: res.data.transactions
          };
          setWallets([wallet]);
        } 
        else {
          setWallets([]);
          setMessage("No wallet data available at the moment.");
        }
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "An error occurred while fetching wallet data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const getTypeBadge = (type) => {
    const config = {
      withdrawal: "bg-red-50 text-red-700",
      deposit: "bg-green-50 text-green-700",
      distribution: "bg-blue-50 text-blue-700",
      transfer: "bg-purple-50 text-purple-700",
      investment: "bg-amber-50 text-amber-700",
    };
    return config[type] || "bg-gray-50 text-gray-700";
  };

  const getStatusBadge = (status) => {
    const config = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    return config[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-[3px] border-gray-100 border-t-orange-500 rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Loading financial data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Funding Checks</h2>
          <p className="text-gray-500 text-sm mt-1">Financial oversight and audit trail</p>
        </div>
        <button
          onClick={fetchWallets}
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

 
      {/* Wallets List */}
      <div className="space-y-6">
        {wallets.map((wallet) => (
          <div key={wallet.wallet_id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            
            {/* Wallet Header */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">{wallet.owner_name}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      Wallet #{wallet.wallet_id}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {wallet.transactions?.length || 0} transactions
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500">Current Balance</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${parseFloat(wallet.balance || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions Section */}
            {wallet.transactions && wallet.transactions.length > 0 && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-gray-900">Transaction History</h4>
                  <button 
                    onClick={() => setExpandedWalletId(expandedWalletId === wallet.wallet_id ? null : wallet.wallet_id)}
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    {expandedWalletId === wallet.wallet_id ? "Show Less" : "Show All"}
                  </button>
                </div>

                <div className={`space-y-3 ${expandedWalletId === wallet.wallet_id ? '' : 'max-h-[300px] overflow-hidden'}`}>
                  {wallet.transactions.map((tx) => (
                    <div key={tx.transaction_id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                      
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left Section - Basic Info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">TX-{tx.transaction_id}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadge(tx.type)}`}>
                              {tx.type}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(tx.status)}`}>
                              {tx.status}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Date:</span> {formatDate(tx.date)}
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Method:</span> {tx.payment_method || 'System'}
                            </div>
                          </div>
                        </div>

                        {/* Right Section - Transfer Details */}
                        <div className="space-y-2">
                          {/* Transfer Flow */}
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">From</div>
                              <div className="text-sm font-medium text-gray-900">{tx.from || 'External'}</div>
                            </div>
                            <div className="text-gray-400">→</div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">To</div>
                              <div className="text-sm font-medium text-gray-900">{tx.to || 'Wallet'}</div>
                            </div>
                          </div>

                          {/* Amount */}
                          <div className={`text-lg font-bold ${tx.direction === 'incoming' ? 'text-green-600' : 'text-gray-900'}`}>
                            {tx.direction === 'incoming' ? '+' : '-'}${parseFloat(tx.amount || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Notes Section */}
                      {tx.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {tx.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!wallet.transactions || wallet.transactions.length === 0) && (
              <div className="p-6 text-center text-gray-500">
                No transactions found for this wallet
              </div>
            )}
          </div>
        ))}
      </div>

   
    </div>
  );
};

export default FundingChecksTab;