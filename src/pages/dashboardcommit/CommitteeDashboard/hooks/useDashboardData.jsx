// src/pages/dashboardcommit/CommitteeDashboard/components/hooks/useDashboardData.jsx
import { useState, useEffect } from 'react';
import { ideaService } from '../services/apiService';

const useDashboardData = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [committeeInfo, setCommitteeInfo] = useState(null);

  const fetchCommitteeIdeas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ideaService.getCommitteeIdeas();
      
      if (response.data) {
        setIdeas(response.data.ideas || []);
        setCommitteeInfo({
          committee_id: response.data.committee_id,
          total_ideas: response.data.ideas?.length || 0
        });
      }
    } catch (err) {
      console.error('Error fetching committee ideas:', err);
      setError(err.response?.data?.message || 'حدث خطأ في جلب البيانات');
      
      // بيانات تجريبية للاختبار
      setIdeas([
        { 
          id: 1, 
          idea_id: 'IDEA-001',
          title: "AI Time Management", 
          description: "Advanced mobile application using neural networks to optimize daily productivity.", 
          status: "pending",
          created_at: "2024-01-15",
          category: "تكنولوجيا"
        },
        { 
          id: 2, 
          idea_id: 'IDEA-002',
          title: "Eco-Tech Marketplace", 
          description: "E-commerce platform specialized in refurbished high-end sustainable technology.", 
          status: "approved",
          created_at: "2024-01-10",
          category: "بيئة"
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitteeIdeas();
  }, []);

  const refetchIdeas = () => {
    fetchCommitteeIdeas();
  };

  const updateIdeaStatus = async (ideaId, newStatus) => {
    try {
      await ideaService.updateIdeaStatus(ideaId, newStatus);
      setIdeas(prevIdeas => 
        prevIdeas.map(idea => 
          idea.id === ideaId ? { ...idea, status: newStatus } : idea
        )
      );
      return true;
    } catch (err) {
      console.error('Error updating idea status:', err);
      return false;
    }
  };

  return {
    ideas,
    loading,
    error,
    committeeInfo,
    refetchIdeas,
    updateIdeaStatus
  };
};

export default useDashboardData;