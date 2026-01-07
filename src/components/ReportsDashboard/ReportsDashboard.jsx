import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchReportsByStage } from "../../services/reportService";
import { useIdea } from "../../context/IdeaContext";

import LoadingSpinner from "../Common/LoadingSpinner";
import ErrorDisplay from "../Common/ErrorDisplay";
import DashboardHeader from "./DashboardHeader";
import ReportsGrid from "./ReportsGrid";
import EmptyState from "./EmptyState";

const reportTypes = {
  initial: { 
    key: "initial", 
    label: "Initial Evaluation Reports", 
    endpoint: 'first-stage-reports',
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  advanced: { 
    key: "advanced", 
    label: "Advanced Evaluation Reports", 
    endpoint: 'advanced-stage-reports',
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  launch_evaluation: { 
    key: "launch_evaluation", 
    label: "Launch Evaluation Reports", 
    endpoint: 'launch-evaluation-reports',
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  post_launch_followup: { 
    key: "post_launch_followup", 
    label: "Post Launch Follow-Up Reports", 
    endpoint: 'post-launch-reports',
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
};

const ReportsDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ideaId: paramsIdeaId } = useParams(); // إزالة reportType من هنا
  const { currentIdea } = useIdea();
  const ideaId = paramsIdeaId || currentIdea?.id;

  const [reports, setReports] = useState([]);
  const [ideaInfo, setIdeaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // استخراج النوع من query parameters بدلاً من params
  const searchParams = new URLSearchParams(location.search);
  const typeFromQuery = searchParams.get('type') || 'initial';
  const [currentType, setCurrentType] = useState(
    reportTypes[typeFromQuery] ? typeFromQuery : 'initial'
  );

  const loadReports = useCallback(async (stageType) => {
    if (!ideaId) {
      setError("No idea has been selected. Please choose an idea first.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await fetchReportsByStage(ideaId, stageType);
      
      console.log('API Response for', stageType, ':', data); // للتصحيح
      
      // البيانات تأتي من الباك إند بهذا الشكل:
      // {
      //   idea: { id, title, status },
      //   total_reports: number,
      //   reports: array
      // }
      
      if (data) {
        // استخراج التقارير
        if (data.reports && Array.isArray(data.reports)) {
          setReports(data.reports);
        } else if (Array.isArray(data)) {
          // للتوافق مع حالات قديمة
          setReports(data);
        } else {
          setReports([]);
        }
        
        // استخراج معلومات الفكرة
        if (data.idea) {
          setIdeaInfo(data.idea);
        }
      } else {
        setReports([]);
        setIdeaInfo(null);
      }
      
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching ${stageType} reports:`, err);
      setError(err.message || `Failed to load ${stageType} reports`);
      setLoading(false);
      setReports([]);
    }
  }, [ideaId]);

  useEffect(() => {
    loadReports(currentType);
  }, [loadReports, currentType]);

  // تحديث currentType عندما يتغير query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const typeFromQuery = searchParams.get('type');
    
    if (typeFromQuery && reportTypes[typeFromQuery] && typeFromQuery !== currentType) {
      setCurrentType(typeFromQuery);
    }
  }, [location.search, currentType]);

  const handleTypeChange = (typeKey) => {
    setCurrentType(typeKey);
    // تحديث الـ URL مع الحفاظ على ideaId وإضافة query parameter للنوع
    navigate(`/ideas/${ideaId}/reports?type=${typeKey}`, { replace: true });
  };

  if (!ideaId) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <ErrorDisplay
          error="No idea has been selected to view its reports"
          type="general"
          showBackButton={true}
          showHomeButton={false}
          onRetry={() => navigate("/profile")}
          buttonText="Back to Profile"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <LoadingSpinner type="reports" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <ErrorDisplay 
          error={error} 
          type="reports" 
          onRetry={() => loadReports(currentType)} 
        />
      </div>
    );
  }

  const currentReportType = reportTypes[currentType] || reportTypes.initial;

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="p-4 md:p-6 flex flex-col h-full">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <DashboardHeader
            ideaInfo={ideaInfo}
            ideaId={ideaId}
            totalReports={reports.length}
            currentType={currentReportType.label}
          />
        </div>

        {/* Report Type Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Report Type:</h2>
          <div className="flex flex-wrap gap-3">
            {Object.values(reportTypes).map((type) => (
              <button
                key={type.key}
                onClick={() => handleTypeChange(type.key)}
                className={`px-5 py-3 rounded-lg font-medium transition-all duration-300 ${
                  currentType === type.key
                    ? `${type.bgColor} ${type.color} border-2 border-current shadow-md`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Current Report Type Info */}
        <div className={`p-5 rounded-xl mb-8 ${currentReportType.bgColor} border-l-4 ${currentReportType.color} border-l-current`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {currentReportType.label}
              </h3>
              <p className="text-gray-700">
                {currentType === 'initial' && 'Initial evaluation reports from committee members.'}
                {currentType === 'advanced' && 'Advanced evaluation reports before funding approval.'}
                {currentType === 'launch_evaluation' && 'Reports evaluating the launch readiness and performance.'}
                {currentType === 'post_launch_followup' && 'Follow-up reports after project launch.'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">{reports.length}</div>
              <div className="text-gray-600 text-sm">Total Reports</div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="flex-1 flex flex-col">
          {reports.length > 0 ? (
            <ReportsGrid 
              reports={reports} 
              ideaInfo={ideaInfo} 
              currentType={currentType}
            />
          ) : (
            <EmptyState 
              message={`No ${currentReportType.label.toLowerCase()} found for this idea.`}
              type={currentType}
              ideaId={ideaId}
              onAddReport={() => {
                // يمكنك إضافة وظيفة لإضافة تقرير جديد هنا
                console.log('Add new report for type:', currentType);
              }}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/ideas/${ideaId}/roadmap`)}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Roadmap
            </button>
            
            <button
              onClick={() => navigate(`/ideas/${ideaId}`)}
              className="flex items-center gap-2 px-5 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Idea Details
            </button>
          </div>
          
          <div className="text-gray-500 text-sm text-center">
            <p>Last update: {new Date().toLocaleString()}</p>
            <p className="mt-1">Showing {reports.length} report(s)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;