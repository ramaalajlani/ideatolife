import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchIdeaReports } from "../../services/reportService";
import { useIdea } from "../../context/IdeaContext";

import LoadingSpinner from "../Common/LoadingSpinner";
import ErrorDisplay from "../Common/ErrorDisplay";
import DashboardHeader from "./DashboardHeader";
import ReportsGrid from "./ReportsGrid";
import EmptyState from "./EmptyState";
import SummaryStats from "./SummaryStats";

const ReportsDashboard = () => {
  const navigate = useNavigate();
  const { ideaId: paramsIdeaId } = useParams();
  const { currentIdea } = useIdea();
  
  const ideaId = paramsIdeaId || currentIdea?.id;
  
  const [reports, setReports] = useState([]);
  const [totalReports, setTotalReports] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ideaInfo, setIdeaInfo] = useState(null);

  const loadReports = useCallback(async () => {
    if (!ideaId) {
      setError("لم يتم تحديد فكرة. يرجى اختيار فكرة أولاً.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetchIdeaReports(ideaId);
      
      const formattedReports = res.data.map(report => ({
        id: report.report_id,
        type: report.report_type,
        description: report.description,
        score: parseFloat(report.evaluation_score),
        status: report.status,
        idea: {
          id: report.idea.id,
          title: report.idea.title,
          status: report.idea.status
        },
        committee: report.committee,
        strengths: report.strengths ? 
          report.strengths.split('\n').filter(item => item.trim()) : [],
        weaknesses: report.weaknesses ? 
          report.weaknesses.split('\n').filter(item => item.trim()) : [],
        recommendations: report.recommendations ? 
          report.recommendations.split('\n').filter(item => item.trim()) : [],
        createdAt: report.created_at
      }));
      
      setReports(formattedReports);
      setTotalReports(res.total_reports);
      setIdeaInfo(formattedReports.length > 0 ? formattedReports[0].idea : currentIdea);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError("فشل في تحميل التقارير. يرجى المحاولة مرة أخرى.");
      setLoading(false);
    }
  }, [ideaId, currentIdea]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // إظهار رسالة إذا لم يتم اختيار فكرة
  if (!ideaId) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <ErrorDisplay 
            error="لم يتم اختيار فكرة لعرض تقاريرها"
            type="general"
            showBackButton={true}
            showHomeButton={false}
            onRetry={() => navigate('/profile')}
            buttonText="العودة للبروفايل"
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <LoadingSpinner type="reports" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <ErrorDisplay error={error} type="reports" onRetry={loadReports} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="p-4 md:p-6 h-full flex flex-col">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <DashboardHeader 
            ideaInfo={ideaInfo} 
            ideaId={ideaId} 
            totalReports={totalReports}
            reports={reports}
          />
        </div>

        {/* Main Content Section */}
        <div className="flex-1 flex flex-col">
          {/* Section Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-8 gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-white text-center sm:text-left">
                تقارير التقييم <span className="text-orange-400">({totalReports})</span>
              </h2>
              <RefreshButton onReload={loadReports} />
            </div>
          </div>
          
          {/* Reports Content Area - Takes full available space */}
          <div className="flex-1">
            {totalReports > 0 ? (
              <div className="h-full">
                <ReportsGrid reports={reports} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <EmptyState ideaId={ideaId} />
              </div>
            )}
          </div>

          {/* Summary Stats - Below reports */}
          {totalReports > 0 && (
            <div className="mt-8">
              <SummaryStats reports={reports} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <Footer />
        </div>
      </div>
    </div>
  );
};

const RefreshButton = ({ onReload }) => (
  <div className="flex items-center gap-3">
    <div className="text-gray-400 text-sm">
      {new Date().toLocaleTimeString('ar-SA')}
    </div>
    <button 
      onClick={onReload}
      className="text-gray-400 hover:text-white transition-colors"
      title="تحديث"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </button>
  </div>
);

const Footer = () => (
  <div className="text-center text-gray-500 text-sm">
    <p>© {new Date().getFullYear()} نظام إدارة الأفكار • جميع الحقوق محفوظة</p>
    <p className="mt-1">آخر تحديث للبيانات: {new Date().toLocaleString('ar-SA')}</p>
  </div>
);

export default ReportsDashboard;