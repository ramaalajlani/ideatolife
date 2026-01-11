import React, { useState, useEffect } from "react";
import axios from "axios";

const FollowupCard = ({ 
  item, 
  index, 
  handleInputChange, 
  handleUpdate, 
  handleAcknowledge, 
  updating, 
  acknowledging, 
  ownerResponse, 
  setOwnerResponse,
  token
}) => {
  const f = item.followup;
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [profitData, setProfitData] = useState(null);
  const [loadingProfit, setLoadingProfit] = useState(false);
  const [profitError, setProfitError] = useState(null);
  const [showProfitDetails, setShowProfitDetails] = useState(false);
  
  // Function to fetch report from API
  const fetchReport = async () => {
    if (!f.id || !item.idea.id) return;
    
    setLoadingReport(true);
    setReportError(null);
    
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/ideas/${item.idea.id}/post-launch-reports/${f.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      if (error.response?.status !== 404) {
        setReportError(
          error.response?.data?.message || 
          'An error occurred while fetching the report. Please try again.'
        );
      }
    } finally {
      setLoadingReport(false);
    }
  };

  // Function to fetch profit distribution data
  const fetchProfitDistribution = async () => {
    if (!item.idea.id) return;
    
    setLoadingProfit(true);
    setProfitError(null);
    
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/ideas/${item.idea.id}/profit-distribution-summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      setProfitData(response.data);
      setShowProfitDetails(true);
    } catch (error) {
      console.error('Error fetching profit distribution:', error);
      if (error.response?.status === 403) {
        setProfitError("You are not authorized to access this data.");
      } else if (error.response?.status !== 404) {
        setProfitError(
          error.response?.data?.message || 
          'An error occurred while fetching profit distribution data.'
        );
      }
    } finally {
      setLoadingProfit(false);
    }
  };

  // Automatically fetch report when component loads
  useEffect(() => {
    if (f.status === "done" || f.status === "pending_review") {
      fetchReport();
    }
    
    // Fetch profit data if distribution is complete
    if (f.profit_distributed) {
      fetchProfitDistribution();
    }
  }, [f.id, item.idea.id, f.status, f.profit_distributed, token]);
  
  let cardColorClass = "bg-white";
  let statusColor = "bg-gray-100 text-gray-800";
  let statusText = f.status;
  
  if (f.status === "pending") {
    cardColorClass = "bg-white border-l-4 border-orange-500";
    statusColor = "bg-orange-100 text-orange-800";
    statusText = "Pending Actions";
  } else if (f.status === "done") {
    cardColorClass = "bg-white border-l-4 border-green-500";
    statusColor = "bg-green-100 text-green-800";
    statusText = "Completed";
  } else if (f.status === "pending_review") {
    cardColorClass = "bg-white border-l-4 border-blue-500";
    statusColor = "bg-blue-100 text-blue-800";
    statusText = "Under Committee Review";
  }
  
  let decisionColor = "bg-gray-100 text-gray-800";
  let decisionText = f.committee_decision || "No decision yet";
  
  const decisionMap = {
    graduate: "Graduate Project",
    continue: "Continue Operations",
    extra_support: "Extra Support Required",
    pivot_required: "Pivot Required",
    terminate: "Terminate Project"
  };

  if (f.committee_decision) {
    decisionText = decisionMap[f.committee_decision] || f.committee_decision;
    if (f.committee_decision === "graduate") decisionColor = "bg-green-600 text-white";
    else if (f.committee_decision === "terminate") decisionColor = "bg-red-600 text-white";
    else decisionColor = "bg-blue-600 text-white";
  }

  const requiresOwnerInput = f.status === "pending" && (!f.active_users || !f.revenue || !f.growth_rate);
  const requiresOwnerResponse = f.committee_decision && !f.owner_acknowledged && f.status === "done";

  // Calculate Evaluation Score from report if available
  const evaluationScore = reportData?.report?.evaluation_score !== undefined 
    ? reportData.report.evaluation_score 
    : f.evaluation_score;

  // Calculate total percentages
  const totalPercentage = profitData?.distributions?.reduce((sum, dist) => {
    const percentage = parseFloat(dist.percentage);
    return sum + (isNaN(percentage) ? 0 : percentage);
  }, 0) || 0;

  // Calculate total amounts
  const totalAmount = profitData?.distributions?.reduce((sum, dist) => {
    const amount = parseFloat(dist.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0) || 0;

  // Help Tooltip Components
  const HelpTooltip = ({ text, children }) => (
    <div className="relative group inline-block">
      <div className="cursor-help text-gray-400 hover:text-blue-500 inline-flex items-center">
        {children}
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <div className="invisible group-hover:visible absolute z-10 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
        <div className="text-center font-medium">{text}</div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );

  // Info Label Components with help
  const InfoLabel = ({ label, value, description, icon, color = "text-gray-700" }) => (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-xs font-bold text-gray-500">{label}</span>
        {description && <HelpTooltip text={description} />}
      </div>
      <div className="flex items-center gap-2">
        {icon && <span className={icon}></span>}
        <span className={`text-sm font-medium ${color}`}>{value}</span>
      </div>
    </div>
  );

  return (
    <div key={f.id} className={`rounded-xl shadow-md overflow-hidden mb-8 border border-gray-200 ${cardColorClass}`} dir="ltr">
      <div className="p-6">
        
        {/* Card Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b pb-4">
          <div>
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{item.idea.title}</h3>
            <div className="flex flex-wrap gap-2 mt-3 text-sm font-bold">
              <span className={`px-4 py-1 rounded-md uppercase tracking-wider ${statusColor}`}>
                {statusText}
              </span>
              <span className="px-4 py-1 bg-gray-800 text-white rounded-md uppercase">
                Phase: {f.phase?.replace('_', ' ')}
              </span>
              <span className="px-4 py-1 bg-gray-100 text-gray-600 rounded-md">
                Date: {new Date(f.scheduled_date).toLocaleDateString('en-US')}
              </span>
            </div>
          </div>
          
          {f.committee_decision && (
            <div className="text-right">
              <div className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1 justify-end">
                Committee Decision
                <HelpTooltip text="The final decision made by the follow-up committee regarding your project">
                  <span></span>
                </HelpTooltip>
              </div>
              <span className={`px-6 py-2 text-sm font-black rounded-lg uppercase shadow-sm ${decisionColor}`}>
                {decisionText}
              </span>
            </div>
          )}
        </div>

        {/* Alerts Section */}
        {(requiresOwnerInput || requiresOwnerResponse || f.profit_distributed) && (
          <div className="mb-6 space-y-2">
            {requiresOwnerInput && (
              <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.33 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span>ATTENTION: Please submit the required follow-up data before the deadline.</span>
                <HelpTooltip text="This data is essential for evaluating your project's performance and making appropriate decisions by the committee">
                  <span></span>
                </HelpTooltip>
              </div>
            )}
            {requiresOwnerResponse && (
              <div className="bg-purple-50 border border-purple-200 text-purple-800 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                </svg>
                <span>ACTION REQUIRED: Please respond to the committee decision and acknowledge review.</span>
                <HelpTooltip text="Your response is important for understanding the committee's decision and planning next steps for your project">
                  <span></span>
                </HelpTooltip>
              </div>
            )}
            {f.profit_distributed && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm font-bold flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>
                    ✅ SUCCESS: Profits have been successfully distributed to project participants.
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (!profitData) {
                      fetchProfitDistribution();
                    } else {
                      setShowProfitDetails(!showProfitDetails);
                    }
                  }}
                  className="px-4 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold hover:bg-green-200 transition-colors flex items-center gap-1"
                >
                  {showProfitDetails ? "Hide Details" : "View Distribution"}
                  <HelpTooltip text="View details of profit distribution among project participants">
                    <span></span>
                  </HelpTooltip>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Profit Distribution Section */}
        {f.profit_distributed && showProfitDetails && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl overflow-hidden">
            <div className="bg-green-100 px-6 py-4 border-b border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h4 className="text-xl font-black text-green-900 uppercase tracking-tight">Profit Distribution Summary</h4>
                </div>
                {profitData && (
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-700">Total Distributed: ${totalAmount.toFixed(2)}</div>
                    <div className="text-xs text-green-600">Total Percentage: {totalPercentage.toFixed(2)}%</div>
                  </div>
                )}
              </div>
            </div>
            
            {loadingProfit ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-600 mx-auto mb-3"></div>
                <p className="text-green-700 font-medium">Loading profit distribution data...</p>
              </div>
            ) : profitError ? (
              <div className="p-6 bg-red-50 border border-red-200 text-red-800 rounded-lg m-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="font-bold">Error</span>
                </div>
                <p>{profitError}</p>
              </div>
            ) : profitData ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Summary Cards */}
                  <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm">
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                      Your Share
                      <HelpTooltip text="The financial amount you received as the project founder">
                        <span></span>
                      </HelpTooltip>
                    </div>
                    <div className="text-2xl font-black text-green-700">${profitData.your_amount}</div>
                    <div className="text-sm text-green-600 mt-1">{profitData.owner_percentage} of total</div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm">
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                      Status
                      <HelpTooltip text="Status of the profit distribution process">
                        <span></span>
                      </HelpTooltip>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span className="text-lg font-black text-green-700">Successfully Distributed</span>
                    </div>
                    <div className="text-sm text-green-600 mt-1">All participants have received their shares</div>
                  </div>
                </div>
                
                {/* Distribution Table */}
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-black text-green-700 uppercase tracking-wider">Participant</th>
                        <th className="px-6 py-3 text-left text-xs font-black text-green-700 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-black text-green-700 uppercase tracking-wider">Percentage</th>
                        <th className="px-6 py-3 text-left text-xs font-black text-green-700 uppercase tracking-wider">Amount ($)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {profitData.distributions.map((distribution, idx) => (
                        <tr 
                          key={idx} 
                          className={distribution.role === "idea_owner" ? "bg-green-50/50" : "hover:bg-gray-50"}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-700 font-bold text-sm">
                                  {distribution.user_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-bold text-gray-900">{distribution.user_name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                              distribution.role === "idea_owner" 
                                ? "bg-green-100 text-green-800"
                                : distribution.role === "investor"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}>
                              {distribution.role === "idea_owner" ? "Owner" : 
                               distribution.role === "investor" ? "Investor" : 
                               distribution.role === "admin" ? "Admin" : distribution.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                            {distribution.percentage}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-green-700">
                            ${distribution.amount}
                          </td>
                        </tr>
                      ))}
                      
                      {/* Total Row */}
                      <tr className="bg-green-100 border-t-2 border-green-300">
                        <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-sm font-black text-green-900 uppercase">
                          TOTAL
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-green-900">
                          {totalPercentage.toFixed(2)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-green-900">
                          ${totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-100 rounded"></div>
                    <span className="text-gray-600">Owner's share highlighted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-100 rounded"></div>
                    <span className="text-gray-600">Investor shares</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-100 rounded"></div>
                    <span className="text-gray-600">Admin shares</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-gray-500 italic">No profit distribution data available</p>
                <button 
                  onClick={fetchProfitDistribution}
                  className="mt-3 px-4 py-2 text-sm bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors font-bold"
                >
                  Load Distribution Data
                </button>
              </div>
            )}
          </div>
        )}

        {/* All Data - Divided into sections */}
        <div className="space-y-8">
          
          {/* First Section: Key Indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Key Performance Indicators */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th colSpan="2" className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-widest">
                      Key Performance Indicators
                      <HelpTooltip text="The core metrics used by the committee to evaluate your project's performance">
                        <span></span>
                      </HelpTooltip>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-500 bg-gray-50/50 w-1/2 flex items-center gap-1">
                      <span>Active Users</span>
                      <HelpTooltip text="Number of users who regularly use your product during the follow-up period">
                        <span></span>
                      </HelpTooltip>
                    </td>
                    <td className="px-4 py-3 text-sm font-black text-gray-900">{f.active_users ?? "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-500 bg-gray-50/50 flex items-center gap-1">
                      <span>Revenue ($)</span>
                      <HelpTooltip text="Total income generated by your project during the follow-up period">
                        <span></span>
                      </HelpTooltip>
                    </td>
                    <td className="px-4 py-3 text-sm font-black text-gray-900">{f.revenue ? `$${f.revenue}` : "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-500 bg-gray-50/50 flex items-center gap-1">
                      <span>Growth Rate (%)</span>
                      <HelpTooltip text="Percentage growth in key metrics compared to the previous period">
                        <span></span>
                      </HelpTooltip>
                    </td>
                    <td className="px-4 py-3 text-sm font-black text-gray-900">{f.growth_rate ? `${f.growth_rate}%` : "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-500 bg-gray-50/50 flex items-center gap-1">
                      <span>Evaluation Score</span>
                      <HelpTooltip text="Final evaluation score given by the committee based on all criteria">
                        <span></span>
                      </HelpTooltip>
                    </td>
                    <td className="px-4 py-3 text-sm font-black text-blue-600">
                      {evaluationScore !== null && evaluationScore !== undefined 
                        ? `${parseFloat(evaluationScore)}/100` 
                        : "Not Scored"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Performance & Status */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th colSpan="2" className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-widest">
                      Performance & Status
                      <HelpTooltip text="Your project's performance status based on the committee's comprehensive evaluation">
                        <span></span>
                      </HelpTooltip>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-500 bg-gray-50/50 w-1/2 flex items-center gap-1">
                      <span>Performance Status</span>
                      <HelpTooltip text="Qualitative assessment of your project's performance based on all indicators">
                        <span></span>
                      </HelpTooltip>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold uppercase">
                      <span className={`px-2 py-1 rounded ${f.performance_status === 'excellent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {f.performance_status?.replace('_', ' ') || "-"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-500 bg-gray-50/50 flex items-center gap-1">
                      <span>Risk Level</span>
                      <HelpTooltip text="Assessment of the risk level facing your project based on the report">
                        <span></span>
                      </HelpTooltip>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold uppercase">
                      <span className={`px-2 py-1 rounded ${
                        f.risk_level === 'low' ? 'bg-green-100 text-green-800' :
                        f.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        f.risk_level === 'high' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {f.risk_level || "-"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-500 bg-gray-50/50 flex items-center gap-1">
                      <span>Project Stability</span>
                      <HelpTooltip text="Is your project operating stably without major technical or operational issues?">
                        <span></span>
                      </HelpTooltip>
                    </td>
                    <td className={`px-4 py-3 text-sm font-black ${f.is_stable ? "text-green-600" : "text-orange-500"}`}>
                      {f.is_stable ? "STABLE" : "UNSTABLE"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-500 bg-gray-50/50 flex items-center gap-1">
                      <span>Reviewed By</span>
                      <HelpTooltip text="Name of the committee member who reviewed and evaluated your project">
                        <span></span>
                      </HelpTooltip>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{f.reviewed_by?.name || "Pending Review"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Committee & Owner Info */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th colSpan="2" className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-widest">
                      Committee & Owner Info
                      <HelpTooltip text="Information about owner interaction with committee decisions and recommendations">
                        <span></span>
                      </HelpTooltip>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-500 bg-gray-50/50 w-1/2 flex items-center gap-1">
                      <span>Owner Acknowledged</span>
                      <HelpTooltip text="Has the owner reviewed and responded to the committee's decision?">
                        <span></span>
                      </HelpTooltip>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${f.owner_acknowledged ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {f.owner_acknowledged ? "YES" : "NO"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-500 bg-gray-50/50 flex items-center gap-1">
                      <span>Graduation Date</span>
                      <HelpTooltip text="Date the project graduated from the follow-up program if the decision was to graduate">
                        <span></span>
                      </HelpTooltip>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {f.graduation_date ? new Date(f.graduation_date).toLocaleDateString('en-US') : "Not Graduated"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-500 bg-gray-50/50 flex items-center gap-1">
                      <span>Marketing Support</span>
                      <HelpTooltip text="Did the project receive marketing support from the committee during this period?">
                        <span></span>
                      </HelpTooltip>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${f.marketing_support_given ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {f.marketing_support_given ? "GIVEN" : "NOT GIVEN"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-500 bg-gray-50/50 flex items-center gap-1">
                      <span>Product Issue</span>
                      <HelpTooltip text="Were any product issues detected during the committee review?">
                        <span></span>
                      </HelpTooltip>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${f.product_issue_detected ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                        {f.product_issue_detected ? "DETECTED" : "NO ISSUES"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Second Section: Description & Responses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Risk Description Box */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-1">
                <label className="text-xs font-black text-gray-500 uppercase">Risk Description & Analysis</label>
                <HelpTooltip text="Analysis of potential risks identified for your project during the follow-up period">
                  <span></span>
                </HelpTooltip>
              </div>
              <div className="p-4 bg-white text-sm text-gray-700 min-h-[120px]">
                {f.risk_description ? (
                  <div className="whitespace-pre-line">{f.risk_description}</div>
                ) : (
                  <div className="text-gray-400 italic">No specific risks reported for this period.</div>
                )}
              </div>
            </div>

            {/* Owner Response Box */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-1">
                <label className="text-xs font-black text-gray-500 uppercase">Owner's Official Response</label>
                <HelpTooltip text="Owner's response to the committee's decision and recommendations">
                  <span></span>
                </HelpTooltip>
              </div>
              <div className="p-4 bg-white min-h-[120px]">
                {f.owner_response ? (
                  <div>
                    <p className="text-sm text-gray-800 italic mb-2 whitespace-pre-line">"{f.owner_response}"</p>
                    <div className="mt-3 flex items-center text-xs font-bold text-green-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Committee feedback has been reviewed and acknowledged
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 italic text-sm">No response submitted yet.</div>
                )}
              </div>
            </div>
          </div>

          {/* Third Section: Additional Information */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-1">
              <label className="text-xs font-black text-gray-500 uppercase">Follow-up Details</label>
              <HelpTooltip text="Additional information about the follow-up session and its details">
                <span></span>
              </HelpTooltip>
            </div>
            <div className="p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                    <span>Phase</span>
                    <HelpTooltip text="Current phase of project follow-up">
                      <span></span>
                    </HelpTooltip>
                  </span>
                  <span className="text-sm font-medium text-gray-800 capitalize">{f.phase?.replace('_', ' ')}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                    <span>Scheduled Date</span>
                    <HelpTooltip text="Scheduled date for the follow-up session">
                      <span></span>
                    </HelpTooltip>
                  </span>
                  <span className="text-sm text-gray-800">{new Date(f.scheduled_date).toLocaleDateString('en-US')}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                    <span>Status</span>
                    <HelpTooltip text="Status of the current follow-up session">
                      <span></span>
                    </HelpTooltip>
                  </span>
                  <span className={`text-sm font-bold px-2 py-1 rounded w-max ${statusColor}`}>
                    {statusText}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                    <span>Profit Distribution</span>
                    <HelpTooltip text="Status of profit distribution to project participants">
                      <span></span>
                    </HelpTooltip>
                  </span>
                  <span className={`text-sm font-bold px-2 py-1 rounded w-max ${f.profit_distributed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {f.profit_distributed ? "COMPLETED" : "PENDING"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                    <span>Follow-up Type</span>
                    <HelpTooltip text="Type of follow-up session based on the time phase">
                      <span></span>
                    </HelpTooltip>
                  </span>
                  <span className="text-sm text-gray-800">
                    {f.phase === 'week_1' ? 'Weekly Follow-up' :
                     f.phase === 'month_1' ? 'Monthly Follow-up (1st Month)' :
                     f.phase === 'month_3' ? 'Quarterly Follow-up' :
                     f.phase === 'month_6' ? 'Semi-Annual Follow-up' :
                     'Regular Follow-up'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                    <span>Review Status</span>
                    <HelpTooltip text="Status of committee review for the project">
                      <span></span>
                    </HelpTooltip>
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {f.reviewed_by?.name ? `Reviewed by ${f.reviewed_by.name}` : "Awaiting Review"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Official Report Section */}
        {(f.status === "done" || f.status === "pending_review") && (
          <div className="mt-8 border-t-2 border-dashed pt-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Official Follow-up Report
              </h4>
              
              {loadingReport && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading Report...
                </span>
              )}
            </div>
            
            {reportError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {reportError}
              </div>
            )}
            
            {reportData?.report ? (
              <>
                <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-100 rounded-xl p-5 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        Report Status
                        <HelpTooltip text="Status of the official follow-up report">
                          <span></span>
                        </HelpTooltip>
                      </div>
                      <div className={`text-sm font-black ${reportData.report.status === 'done' ? 'text-green-600' : 'text-blue-600'}`}>
                        {reportData.report.status === 'done' ? 'Completed' : reportData.report.status}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        Report Date
                        <HelpTooltip text="Date the official report was created">
                          <span></span>
                        </HelpTooltip>
                      </div>
                      <div className="text-sm font-black text-gray-900">
                        {new Date(reportData.report.created_at).toLocaleDateString('en-US')}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        Meeting Date
                        <HelpTooltip text="Date of the follow-up meeting with the committee">
                          <span></span>
                        </HelpTooltip>
                      </div>
                      <div className="text-sm font-black text-gray-900">
                        {reportData.report.meeting?.meeting_date 
                          ? new Date(reportData.report.meeting.meeting_date).toLocaleDateString('en-US')
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                  
                  {reportData.report.description && (
                    <div className="mb-4">
                      <div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                        Report Summary
                        <HelpTooltip text="Comprehensive summary of the evaluation and key recommendations">
                          <span></span>
                        </HelpTooltip>
                      </div>
                      <div className="text-sm text-gray-800 bg-white p-4 rounded-lg border border-gray-200 leading-relaxed">
                        {reportData.report.description}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Strengths", val: reportData.report.strengths, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", desc: "Key strengths that distinguish your project" },
                    { label: "Weaknesses", val: reportData.report.weaknesses, icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z", desc: "Weaknesses that need improvement" },
                    { label: "Recommendations", val: reportData.report.recommendations, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", desc: "Committee recommendations for improvement and development" }
                  ].map((box, i) => (
                    box.val && box.val.trim() !== "" && (
                      <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={box.icon}></path>
                          </svg>
                          <span className="text-sm font-black text-gray-800 uppercase flex items-center gap-1">
                            {box.label}
                            <HelpTooltip text={box.desc}>
                              <span></span>
                            </HelpTooltip>
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {box.val}
                        </p>
                      </div>
                    )
                  ))}
                </div>

                {reportData.report.meeting?.notes && (
                  <div className="mb-6 bg-blue-800 text-white rounded-xl p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                      </svg>
                      <span className="text-xs font-bold uppercase opacity-80 flex items-center gap-1">
                        Meeting Notes
                        <HelpTooltip text="Important notes discussed during the follow-up meeting">
                          <span></span>
                        </HelpTooltip>
                      </span>
                    </div>
                    <p className="text-sm italic leading-relaxed">
                      {reportData.report.meeting.notes}
                    </p>
                    {reportData.report.meeting.meeting_date && (
                      <div className="mt-3 text-xs opacity-70 text-right">
                        Meeting held on: {new Date(reportData.report.meeting.meeting_date).toLocaleDateString('en-US')}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Report generated on: {new Date(reportData.report.created_at).toLocaleDateString('en-US')}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                      Final Evaluation Score
                      <HelpTooltip text="The final score your project received in the comprehensive evaluation">
                        <span></span>
                      </HelpTooltip>
                    </div>
                    <div className="text-2xl font-black text-blue-600">{parseFloat(reportData.report.evaluation_score)}/100</div>
                  </div>
                </div>
              </>
            ) : !loadingReport && !reportError ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p className="text-gray-500 italic">No official report available for this follow-up.</p>
                <button 
                  onClick={fetchReport}
                  className="mt-3 px-4 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Try Loading Again
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* ACTION FORM: Update Indicators (Pending Status) */}
        {f.status === "pending" && (
          <div className="mt-8 bg-gray-900 text-white rounded-2xl p-6 shadow-2xl">
            <h4 className="text-xl font-black uppercase mb-4 tracking-tight">Update Follow-up Data</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2 flex items-center gap-1">
                  Active Users *
                  <HelpTooltip text="Number of users who regularly use your product during the follow-up period">
                    <span></span>
                  </HelpTooltip>
                </label>
                <input
                  type="number"
                  value={f.active_users || ""}
                  onChange={(e) => handleInputChange(index, "active_users", e.target.value)}
                  className="w-full bg-gray-800 border-none rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2 flex items-center gap-1">
                  Revenue ($) *
                  <HelpTooltip text="Total income generated by your project during the follow-up period">
                    <span></span>
                  </HelpTooltip>
                </label>
                <input
                  type="number"
                  value={f.revenue || ""}
                  onChange={(e) => handleInputChange(index, "revenue", e.target.value)}
                  className="w-full bg-gray-800 border-none rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2 flex items-center gap-1">
                  Growth Rate (%) *
                  <HelpTooltip text="Percentage growth in key metrics compared to the previous period">
                    <span></span>
                  </HelpTooltip>
                </label>
                <input
                  type="number"
                  value={f.growth_rate || ""}
                  onChange={(e) => handleInputChange(index, "growth_rate", e.target.value)}
                  className="w-full bg-gray-800 border-none rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="text-xs text-gray-400 mb-4">
              * This data is required by the committee to evaluate your project's performance and make appropriate decisions
            </div>
            <button
              onClick={() => handleUpdate(f.id, index)}
              disabled={updating || (!f.active_users || !f.revenue || !f.growth_rate)}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-lg transition-all disabled:opacity-30 flex items-center justify-center gap-2"
            >
              {updating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : "Submit to Committee"}
            </button>
          </div>
        )}

        {/* ACTION FORM: Respond to Committee */}
        {requiresOwnerResponse && (
          <div className="mt-8 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Decision Response Form</h4>
                <p className="text-purple-600 text-sm font-medium mt-1">Please provide your feedback regarding the committee's decision</p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-1">
                Your Official Response
                <span className="text-red-500 ml-1">*</span>
                <HelpTooltip text="Share your thoughts and reactions to the committee's decision and their recommendations">
                  <span></span>
                </HelpTooltip>
              </label>
              <textarea
                value={ownerResponse}
                onChange={(e) => setOwnerResponse(e.target.value)}
                rows="5"
                className="w-full bg-white border border-gray-300 rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Type your detailed response here..."
              />
              <div className="flex justify-between items-center mt-3 text-sm">
                <span className={`font-medium ${ownerResponse.trim().length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                  {ownerResponse.trim().length > 0 ? '✓ Response ready to send' : 'Please write your response'}
                </span>
                <span className="text-gray-400">
                  {ownerResponse.length}/2000 characters
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={() => setOwnerResponse("")}
                disabled={acknowledging || !ownerResponse.trim()}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Response
              </button>
              <button
                onClick={() => handleAcknowledge(f.id, index)}
                disabled={acknowledging || !ownerResponse.trim()}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black uppercase tracking-widest rounded-lg hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {acknowledging ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Response...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Confirm & Send Response
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowupCard;