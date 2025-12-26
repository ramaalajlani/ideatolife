// src/hooks/useReports.js
import { useState, useEffect, useCallback } from "react";
import { fetchIdeaReports } from "../services/reportService";

export const useReports = (ideaId) => {
  const [state, setState] = useState({
    reports: [],
    totalReports: 0,
    loading: true,
    error: null,
    ideaInfo: null
  });

  const loadReports = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const res = await fetchIdeaReports(ideaId);
      
      // تحويل البيانات
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
      
      setState({
        reports: formattedReports,
        totalReports: res.total_reports,
        loading: false,
        error: null,
        ideaInfo: formattedReports.length > 0 ? formattedReports[0].idea : null
      });
      
    } catch (error) {
      console.error("Error fetching reports:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: "فشل في تحميل التقارير. يرجى المحاولة مرة أخرى."
      }));
    }
  }, [ideaId]);

  useEffect(() => {
    if (ideaId) {
      loadReports();
    } else {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "لم يتم توفير معرف الفكرة" 
      }));
    }
  }, [ideaId, loadReports]);

  return {
    ...state,
    reloadReports: loadReports
  };
};