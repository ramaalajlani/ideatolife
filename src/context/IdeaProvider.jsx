// src/context/IdeaProvider.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api';
import IdeaContext from './IdeaContext';

export const IdeaProvider = ({ children }) => {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // جلب أفكار المستخدم
  const fetchUserIdeas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/ideas');
      setIdeas(response.data.ideas || []);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'حدث خطأ في جلب الأفكار';
      setError(errorMessage);
      console.error('Error fetching ideas:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // جلب خارطة الطريق
  const fetchIdeaRoadmap = async (ideaId) => {
    try {
      setLoading(true);
      const response = await api.get(`/ideas/${ideaId}/roadmap`);
      setSelectedIdea(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'حدث خطأ في جلب خارطة الطريق';
      setError(errorMessage);
      console.error('Error fetching roadmap:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // جلب التقارير
  const fetchIdeaReports = async (ideaId) => {
    try {
      setLoading(true);
      const response = await api.get(`/ideas/${ideaId}/reports`);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'حدث خطأ في جلب التقارير';
      setError(errorMessage);
      console.error('Error fetching reports:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // إنشاء فكرة
  const createIdea = async (ideaData) => {
    try {
      setLoading(true);
      const response = await api.post('/ideas', ideaData);
      setIdeas(prev => [...prev, response.data.idea]);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'حدث خطأ في إنشاء الفكرة';
      setError(errorMessage);
      console.error('Error creating idea:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserIdeas();
  }, []);

  const value = {
    ideas,
    selectedIdea,
    loading,
    error,
    fetchUserIdeas,
    fetchIdeaRoadmap,
    fetchIdeaReports,
    createIdea,
    setSelectedIdea,
    clearError: () => setError(null)
  };

  return (
    <IdeaContext.Provider value={value}>
      {children}
    </IdeaContext.Provider>
  );
};