import axios from "axios";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/* ===============================
   Request Interceptor
   يضيف التوكن تلقائياً
================================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===============================
   Response Interceptor
   عند انتهاء التوكن أو Unauthenticated
================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // حذف التوكن
      localStorage.removeItem("token");

      // إعادة التوجيه لصفحة تسجيل الدخول
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
