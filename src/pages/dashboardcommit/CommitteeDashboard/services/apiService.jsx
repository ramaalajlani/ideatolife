// src/pages/dashboardcommit/CommitteeDashboard/components/services/apiService.jsx
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// إنشاء instance من axios مع الإعدادات الأساسية
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor لإضافة التوكن تلقائياً
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('committee_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor للتعامل مع الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('committee_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// خدمات الأفكار
export const ideaService = {
  // جلب أفكار اللجنة
  getCommitteeIdeas: () => api.get('/committee/ideas'),
  
  // جلب فكرة محددة
  getIdeaById: (id) => api.get(`/ideas/${id}`),
  
  // تحديث حالة الفكرة
  updateIdeaStatus: (id, status) => api.put(`/ideas/${id}/status`, { status }),
  
  // إضافة تقييم للفكرة
  addEvaluation: (ideaId, data) => api.post(`/ideas/${ideaId}/evaluate`, data),
};