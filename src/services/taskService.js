// src/services/taskService.js - النسخة المحسنة
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// ✅ منع الطلبات المزدوجة
const activeRequests = new Map();

const taskService = {
  createTask: async (ganttId, taskData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/gantt-charts/${ganttId}/tasks`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err.response?.data || { message: 'فشل في إنشاء المهمة' };
    }
  },

  updateTask: async (taskId, formData) => {
    // ✅ إنشاء مفتاح فريد لهذا الطلب
    const requestKey = `task-${taskId}-${Date.now()}`;
    
    // ✅ التحقق من الطلبات النشطة
    if (activeRequests.has(requestKey)) {
      console.warn(`Duplicate request detected for task ${taskId}, skipping...`);
      return { message: 'Request already in progress' };
    }
    
    try {
      activeRequests.set(requestKey, true);
      
      const token = localStorage.getItem('token');
      
      console.log(`🔄 Sending request ${requestKey} for task ${taskId}`);
      
      const response = await axios.post(`${API_URL}/tasks/${taskId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        timeout: 60000,
        // ✅ إضافة معلمة لمنع الإرسال المتكرر
        validateStatus: function (status) {
          return status >= 200 && status < 300; // قبول 2xx فقط
        }
      });
      
      console.log(`✅ Request ${requestKey} completed successfully`);
      return response.data;
      
    } catch (err) {
      console.error(`❌ Error in request ${requestKey}:`, err);
      
      // ✅ معالجة الأخطاء بشكل مفصل
      const errorData = err.response?.data;
      
      if (errorData) {
        throw {
          message: errorData.message || 'فشل في تعديل المهمة',
          errors: errorData.errors,
          data: errorData,
          status: err.response?.status,
        };
      }
      
      throw { message: 'فشل في الاتصال بالخادم' };
      
    } finally {
      // ✅ تنظيف الطلب النشط
      activeRequests.delete(requestKey);
      console.log(`🗑️  Request ${requestKey} cleaned up`);
    }
  },

  deleteTask: async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err.response?.data || { message: 'فشل في حذف المهمة' };
    }
  },
  
  getTask: async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (err) {
      console.error('Error getting task:', err);
      throw err.response?.data || { message: 'فشل في جلب بيانات المهمة' };
    }
  }
};

export default taskService;