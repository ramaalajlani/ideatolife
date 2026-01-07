// src/services/postLaunchService.js
import axios from 'axios';

// إنشاء نسخة axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// إضافة التوكن تلقائياً
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('committee_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const postLaunchService = {
  // الحصول على متابعات ما بعد الإطلاق لفكرة معينة (لصاحب الفكرة)
  async getIdeaFollowups(ideaId) {
    try {
      const response = await api.get(`/ideas/${ideaId}/post-launch-followups`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // الحصول على متابعات اللجنة (لأعضاء اللجنة)
  async getCommitteeFollowups() {
    try {
      const response = await api.get('/my-post-launch-followups-commitee');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // تحديث المتابعة من قبل صاحب الفكرة
  async updateFollowupByOwner(followupId, data) {
    try {
      const response = await api.post(
        `/post-launch-followups/${followupId}/owner-update`,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // تأكيد استلام قرار اللجنة من قبل صاحب الفكرة
  async acknowledgeFollowup(followupId, data) {
    try {
      const response = await api.post(
        `/post-launch-followups/${followupId}/acknowledge`,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // تقييم المتابعة من قبل اللجنة
  async committeeSubmitFollowup(followupId, data) {
    try {
      const response = await api.post(
        `/post-launch-followups/${followupId}/committee-evaluate`,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // معالجة الأخطاء
  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || 'حدث خطأ في الخادم';
      return new Error(message);
    } else if (error.request) {
      return new Error('لا يمكن الاتصال بالخادم');
    } else {
      return new Error('حدث خطأ غير متوقع');
    }
  },

  // وظائف مساعدة
  getStatusText(status) {
    const statuses = {
      'pending': 'في الانتظار',
      'done': 'مكتمل'
    };
    return statuses[status] || status;
  },

  getPhaseLabel(phase) {
    const phases = {
      'month_1': 'الشهر الأول',
      'month_3': 'الشهر الثالث',
      'month_6': 'الشهر السادس',
      'quarter_1': 'الربع الأول',
      'quarter_2': 'الربع الثاني',
      'quarter_3': 'الربع الثالث',
      'quarter_4': 'الربع الرابع',
      'year_1': 'السنة الأولى',
      'final': 'المتابعة النهائية'
    };
    return phases[phase] || phase;
  },

  getPerformanceStatusText(status) {
    const statuses = {
      'excellent': 'ممتاز',
      'stable': 'مستقر',
      'at_risk': 'في خطر',
      'failing': 'فاشل'
    };
    return statuses[status] || status;
  },

  getDecisionText(decision) {
    const decisions = {
      'continue': 'متابعة',
      'extra_support': 'دعم إضافي',
      'pivot_required': 'تغيير الاتجاه',
      'terminate': 'إنهاء',
      'graduate': 'تخرج'
    };
    return decisions[decision] || decision;
  },

  formatDate(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA');
    } catch {
      return dateString;
    }
  },

  formatCurrency(amount) {
    if (!amount && amount !== 0) return 'لم يتم التعبئة';
    return new Intl.NumberFormat('ar-SA').format(amount) + ' ريال';
  }
};

export default postLaunchService;