import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// دالة التسجيل
export const registerIdeaOwner = async (userData) => {
  try {
    const response = await api.post('/register/idea-owner', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

// دالة تسجيل الدخول
export const loginIdeaOwner = async (credentials) => {
  try {
    const response = await api.post('/login/idea-owner', credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

export default api;