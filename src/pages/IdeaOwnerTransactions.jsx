import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  CreditCard,
  User,
  FileText,
  DollarSign,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Stamp,
} from "lucide-react";

const IdeaOwnerTransactions = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/idea-owner/transactions");

      if (res.data) {
        setWallet({
          wallet_id: res.data.wallet_id,
          owner_name: res.data.owner_name,
          balance: res.data.balance,
        });

        if (res.data.transactions?.length > 0) {
          setTransactions(res.data.transactions);
          setMessage("");
        } else {
          setTransactions([]);
          setMessage("No transactions available at the moment.");
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setMessage("Access denied. Please log in.");
      } else {
        setMessage(
          err.response?.data?.message ||
            "An error occurred while fetching transactions."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-600 font-medium">
            Loading transactions...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 font-inter">

      {/* Header */}
      <div className="flex justify-between items-end border-b-2 border-gray-100 pb-4">
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
       MY checks
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Official records of all wallet movements
          </p>
        </div>
        <button
          onClick={fetchTransactions}
          className="px-6 py-2 bg-gray-900 text-white text-xs font-bold rounded shadow-lg hover:bg-gray-800 transition-all uppercase tracking-widest"
        >
          Refresh Ledger
        </button>
      </div>

      {message && (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded shadow-sm font-medium">
          {message}
        </div>
      )}

      {transactions.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {transactions.map((tx) => (
            <div
              key={tx.transaction_id}
              className="relative bg-[#fdfdfd] border-2 border-gray-200 rounded-lg p-6 shadow-md overflow-hidden"
              style={{
                backgroundImage: "radial-gradient(#e5e7eb 0.5px, transparent 0.5px)",
                backgroundSize: "20px 20px",
              }}
            >
              {/* Check Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded">
                    <CreditCard className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 uppercase text-sm leading-none">Official Voucher</h4>
                    <p className="text-[10px] text-gray-400 font-mono">ID: {tx.transaction_id}</p>
                  </div>
                </div>
                <div className="text-right border-b-2 border-gray-900 px-4 py-1">
                  <span className="text-2xl font-black text-gray-900">
                    ${Number(tx.amount).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Check Body */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b border-gray-300 border-dashed pb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase min-w-[60px]">Type:</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded uppercase">
                    {tx.type || "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-4 border-b border-gray-300 border-dashed pb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase min-w-[60px]">Pay to:</span>
                  <span className="text-lg font-serif italic text-gray-800">{tx.to || "Unspecified"}</span>
                </div>

                <div className="flex items-center gap-4 border-b border-gray-300 border-dashed pb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase min-w-[60px]">From:</span>
                  <span className="text-lg font-serif italic text-gray-800">{tx.from || "Unspecified"}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Status & Method</span>
                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded uppercase">
                        {tx.status}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded uppercase">
                        {tx.payment_method}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Date Issued</span>
                    <span className="text-sm font-mono font-bold text-gray-700 mt-1">{tx.date}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Notes / Memo</span>
                  <p className="text-xs text-gray-600 italic font-serif">
                    {tx.notes || "No additional information provided for this transaction."}
                  </p>
                </div>
              </div>

              {/* Decorative Stamp for Incoming/Outgoing */}
              <div 
                className={`absolute bottom-4 right-8 transform rotate-12 opacity-20 border-4 px-4 py-1 rounded-md font-black text-2xl uppercase pointer-events-none
                ${tx.direction === "incoming" ? "border-green-600 text-green-600" : "border-red-600 text-red-600"}`}
              >
                {tx.direction === "incoming" ? "RECEIVED" : "DISBURSED"}
              </div>

              {/* Check Footer Line */}
              <div className="mt-6 flex justify-between items-center opacity-40">
                <span className="font-mono text-[10px]">⑆ 000123 ⑆ 456789012 ⑈ {tx.transaction_id}</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter italic">Official Digital Record</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !message && (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-20 text-center">
            <CreditCard className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest">
              No Transactions Logged
            </h3>
            <p className="text-gray-400 text-sm mt-2 font-medium italic">
              The ledger is currently empty.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default IdeaOwnerTransactions;