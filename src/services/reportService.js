// services/reportService.js
import axios from 'axios';

// إنشاء instance مع الإعدادات
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // تأكد من الرابط الصحيح لسيرفرك
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// إضافة التوكن تلقائياً
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// إضافة interceptor للـ response لمعالجة الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // إذا انتهت صلاحية التوكن
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const fetchReportsByStage = async (ideaId, stageType) => {
  try {
    let endpoint;
    switch (stageType) {
      case 'initial':
        endpoint = `/ideas/${ideaId}/first-stage-reports`;
        break;
      case 'advanced':
        endpoint = `/ideas/${ideaId}/advanced-stage-reports`;
        break;
      case 'launch_evaluation':
        endpoint = `/ideas/${ideaId}/launch-evaluation-reports`;
        break;
      case 'post_launch_followup':
        endpoint = `/ideas/${ideaId}/post-launch-reports`;
        break;
      default:
        throw new Error('Invalid stage type');
    }

    console.log(`Fetching reports from: ${endpoint}`); // للتصحيح
    
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${stageType} reports:`, error);
    
    let errorMessage = 'حدث خطأ أثناء تحميل التقارير';
    
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'غير مصرح. يرجى تسجيل الدخول مرة أخرى.';
      } else if (error.response.status === 403) {
        errorMessage = 'ليس لديك صلاحية لعرض هذه التقارير.';
      } else if (error.response.status === 404) {
        errorMessage = 'لم يتم العثور على الفكرة أو التقارير.';
      } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.request) {
      errorMessage = 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.';
    }
    
    throw new Error(errorMessage);
  }
};

// دالة لجلب جميع التقارير (إن احتجتها)
export const fetchAllReportsByType = async (ideaId) => {
  try {
    const [initial, advanced, launch, postLaunch] = await Promise.allSettled([
      fetchReportsByStage(ideaId, 'initial'),
      fetchReportsByStage(ideaId, 'advanced'),
      fetchReportsByStage(ideaId, 'launch_evaluation'),
      fetchReportsByStage(ideaId, 'post_launch_followup')
    ]);

    const result = {
      initial: initial.status === 'fulfilled' ? initial.value : null,
      advanced: advanced.status === 'fulfilled' ? advanced.value : null,
      launch_evaluation: launch.status === 'fulfilled' ? launch.value : null,
      post_launch_followup: postLaunch.status === 'fulfilled' ? postLaunch.value : null,
    };

    // حساب إجمالي التقارير
    let totalReports = 0;
    Object.values(result).forEach(data => {
      if (data && data.reports) {
        totalReports += data.reports.length;
      } else if (data && Array.isArray(data)) {
        totalReports += data.length;
      }
    });

    result.totalReports = totalReports;

    return result;
  } catch (error) {
    console.error('Error fetching all reports:', error);
    throw error;
  }
};